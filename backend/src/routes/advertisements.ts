/*
 * File: reviews.ts
 * Author: Harsh Mehta <harsh.mehta@dal.ca>
 * Date: 2024-07-30
 * Description: API operations for the advertisements.
 */

import { Router } from 'express';
import { getDB } from '../config/database';
import { ObjectId } from 'mongodb';

const router = Router();

// Get all Advertisement
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const db = getDB();
        const advertisements = await db.collection('advertisements').find()
            .sort({ createdDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();
        const totalAdvertisements = await db.collection('advertisements').countDocuments();

        res.status(200).json({
            advertisements,
            totalPages: Math.ceil(totalAdvertisements / limit),
            currentPage: page
        });
        // res.json(gyms);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create a advertisement
router.post('/', async (req, res) => {
    const advertisement = {
        title: req.body.title,
        image: "",
        gymId: req.body.gymId,
        description: req.body.description,
        createdAt: new Date()

    };

    if (req.body.image)
        advertisement.image = req.body.image


    try {
        const db = getDB();
        const result = await db.collection('advertisements').insertOne(advertisement);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get a gym by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDB();
        const gym = await db.collection('advertisements').findOne({ _id: new ObjectId(req.params.id) });
        if (!gym) {
            return res.status(404).json({ message: 'Cannot find advertisement' });
        }
        res.json(gym);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update a gym
router.put('/:id', async (req, res) => {
    try {
        const db = getDB();
        const advertisement = await db.collection('advertisements').findOne({ _id: new ObjectId(req.params.id) });
        if (!advertisement) {
            return res.status(404).json({ message: 'Cannot find advertisement' });
        }

        const updatedGym = {
            ...advertisement,
            ...req.body,
        };

        await db.collection('advertisements').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedGym });
        res.json(updatedGym);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a Advertisement
router.delete('/:id', async (req, res) => {
    const db = getDB();
    const result = await db.collection('advertisements').deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) {
        return res.status(404).json({ message: 'Cannot find advertisement' });
    }
    res.json({ message: 'Deleted Advertisement' });
});

router.get('/gym/:gymId', async (req, res) => {
    try {
        const { gymId } = req.params;
        console.log("gymId", gymId);
        const db = getDB();
        const advertisements = await db.collection('advertisements').find({ gymId: gymId }).toArray();
        if (!advertisements) {
            return res.status(200).json([]);
        }
        res.json(advertisements);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Error handling middleware
// router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
// });

export default router;