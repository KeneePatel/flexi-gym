/*
 * File: reviews.ts
 * Author: Harsh Mehta <harsh.mehta@dal.ca>
 * Date: 2024-07-30
 * Description: API operations for the gyms.
 */

import { Router } from 'express';
import { getDB } from '../config/database';
import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, ObjectId, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

const router = Router();

// Get all gyms
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const gyms = await db.collection('gyms').find().toArray();
        res.json(gyms);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create a gym
router.post('/', async (req, res) => {
    const gym = {
        name: req.body.name,
        location: req.body.location,
        amenities: req.body.amenities,
    };

    try {
        const db = getDB();
        const result = await db.collection('gyms').insertOne(gym);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get a gym by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDB();
        const gym = await db.collection('gyms').findOne({ _id: new ObjectId(req.params.id) });
        if (!gym) {
            return res.status(404).json({ message: 'Cannot find gym' });
        }
        res.json(gym);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update a gym
router.patch('/:id', async (req, res) => {
    try {
        const db = getDB();
        const gym = await db.collection('gyms').findOne({ _id: new ObjectId(req.params.id) });
        if (!gym) {
            return res.status(404).json({ message: 'Cannot find gym' });
        }

        const updatedGym = {
            ...gym,
            ...req.body,
        };

        await db.collection('gyms').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedGym });
        res.json(updatedGym);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a gym
router.delete('/:id', async (req, res) => {
    const db = getDB();
    const result = await db.collection('gyms').deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) {
        return res.status(404).json({ message: 'Cannot find gym' });
    }
    res.json({ message: 'Deleted Gym' });
});

// Get gyms by userId for gym owner
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("userId", userId);
        const db = getDB();
        const gyms = await db.collection('gyms').find({ userId: userId }).toArray();
        if (!gyms) {
            return res.status(404).json({ message: 'Cannot find gym' });
        }
        res.json(gyms);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

interface Gym {
    _id: ObjectId;
    name: string;
    location: {
        city: string;
    };
    about: string;
    images: string[];
    tagline: string;
    price: number;
    ratings: {
        totalRatings: number;
        count: number;
    };
}

let gymsCollection: Collection<Gym>;

// Initialize the database and collections
const initializeCollections = async (): Promise<void> => {
    const database: Db = await getDB();
    gymsCollection = database.collection<Gym>('gyms');
};

// Route to handle searching and sorting of gyms
router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await initializeCollections();

        const { name, city, sortOption } = req.body;
        let query: any = {};

        // Handle name search
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // Handle city search
        if (city) {
            query['location.city'] = { $regex: city, $options: 'i' };
        }

        const gyms = await gymsCollection.find(query).toArray() as Gym[];

        // Sort the gyms in memory based on the selected sort option
        switch (sortOption) {
            case 'Price (lowest first)':
                gyms.sort((a, b) => a.price - b.price);
                break;
            case 'Best reviewed and lowest price':
                gyms.sort((a, b) => {
                    const avgRatingA = a.ratings.count > 0 ? a.ratings.totalRatings / a.ratings.count : 0;
                    const avgRatingB = b.ratings.count > 0 ? b.ratings.totalRatings / b.ratings.count : 0;
                    return avgRatingB - avgRatingA || a.price - b.price;
                });
                break;
            case 'Property rating (high to low)':
                gyms.sort((a, b) => {
                    const avgRatingA = a.ratings.count > 0 ? a.ratings.totalRatings / a.ratings.count : 0;
                    const avgRatingB = b.ratings.count > 0 ? b.ratings.totalRatings / b.ratings.count : 0;
                    return avgRatingB - avgRatingA;
                });
                break;
            default:
                // No additional sorting if not specified
                break;
        }

        // Limit the results if a city is not specified
        const limitedGyms = city ? gyms : gyms.slice(0, 10);

        res.json(limitedGyms);
    } catch (error) {
        console.error('Failed to find gyms:', error);
        next(error);  // Pass errors to the error handling middleware
    }
});

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

export default router;

// interface Gym {
//     _id: ObjectId;
//     name: string;
//     location: {
//         city: string;
//         // Additional location fields as needed
//     };
//     about: string;
//     images: string[];
//     tagline: string;
//     price: number; // Assuming price is stored as a number
// }

// let gymsCollection: Collection<Gym>;

// // Initialize the database and collections
// const initializeCollections = async (): Promise<void> => {
//     const database: Db = await getDB();
//     gymsCollection = database.collection<Gym>('gyms');
// };

// // Route to handle searching and sorting of gyms
// router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await initializeCollections();

//         const { name, city, sortOption } = req.body;
//         let query: any = {};
//         let sort: any = {};

//         // Handle name search
//         if (name) {
//             query.name = { $regex: name, $options: 'i' };  // Case-insensitive search for name
//         }

//         // Handle city search
//         if (city) {
//             query['location.city'] = { $regex: city, $options: 'i' };  // Case-insensitive search for city
//         }

//         // Fetch the gyms from the database without applying sort
//         const gyms = await gymsCollection.find(query).toArray();

//         // Sort the gyms in memory based on the selected sort option
//         switch (sortOption) {
//             case 'Price (lowest first)':
//                 gyms.sort((a, b) => a.price - b.price);
//                 break;
//             case 'Best reviewed and lowest price':
//                 gyms.sort((a, b) => {
//                     const avgRatingA = a.ratings.count > 0 ? a.ratings.totalRatings / a.ratings.count : 0;
//                     const avgRatingB = b.ratings.count > 0 ? b.ratings.totalRatings / b.ratings.count : 0;
//                     return avgRatingB - avgRatingA || a.price - b.price;
//                 });
//                 break;
//             case 'Property rating (high to low)':
//                 gyms.sort((a, b) => {
//                     const avgRatingA = a.ratings.count > 0 ? a.ratings.totalRatings / a.ratings.count : 0;
//                     const avgRatingB = b.ratings.count > 0 ? b.ratings.totalRatings / b.ratings.count : 0;
//                     return avgRatingB - avgRatingA;
//                 });
//                 break;
//             default:
//                 // No additional sorting if not specified
//                 break;
//         }

//                 // Execute the query with the specified sort
//         const limit = city ? 0 : 10;  // Limit to 10 only if no city is specified
        

//         res.json(gyms);
//     } catch (error) {
//         console.error('Failed to find gyms:', error);
//         next(error);  // Pass errors to the error handling middleware
//     }
// });
// // Error handling middleware
// router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
// });


// export default router;
