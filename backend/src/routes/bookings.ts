import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, ObjectId, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { getDB } from '../config/database';

dotenv.config();

const router = express.Router();

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

interface Booking {
    _id: ObjectId;
    userId: string;
    gymId: string;
    startDate: Date;
    endDate: Date;
    charges: number;
    gym: any;
}

interface Gym {
    _id: ObjectId;
    name: string;
    location: string;
    about: string;
    images: string[];
    tagline: string;
    price: string;
}

let bookingsCollection: Collection<Booking>;
let gymsCollection: Collection<Gym>;
let database: Db;

const validateObjectId = (id: string): boolean => {
    return ObjectId.isValid(id);
};

// Initialize the collections and database
const initializeCollections = () => {
    database = getDB();
    bookingsCollection = database.collection<Booking>('bookings');
    gymsCollection = database.collection<Gym>('gyms');
};

router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
    initializeCollections();

    const { userId } = req.params;
    console.log("userId", userId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!validateObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const skip = (page - 1) * limit;

        const bookings = await bookingsCollection
            .find({ userId: userId })
            .skip(skip)
            .limit(limit)
            .toArray();

        const bookingsWithGymDetails = await Promise.all(
            bookings.map(async (booking) => {
                const gym = await gymsCollection.findOne({ _id: new ObjectId(booking.gymId) });

                return {
                    _id: booking._id,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    charges: booking.charges,
                    gym: gym ? gym : null
                };
            })
        );

        console.log("bookingsWithGymDetails", bookingsWithGymDetails);

        const totalItems = await bookingsCollection.countDocuments({ userId: userId });

        res.json({
            currentPage: page,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            items: bookingsWithGymDetails,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:bookingId', async (req: Request, res: Response, next: NextFunction) => {
    initializeCollections();

    const { bookingId } = req.params;

    if (!validateObjectId(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
    }

    try {
        const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const gym = await gymsCollection.findOne({ _id: new ObjectId(booking.gymId) });

        res.json({
            _id: booking._id,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            charges: booking.charges,
            gym: gym ? gym : null
        });
    } catch (error) {
        next(error);
    }
});

// New route to delete a booking
router.delete('/:bookingId', async (req: Request, res: Response, next: NextFunction) => {
    initializeCollections();

    const { bookingId } = req.params;

    if (!validateObjectId(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
    }

    try {
        const result = await bookingsCollection.deleteOne({ _id: new ObjectId(bookingId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// New route to update a booking
router.put('/:bookingId', async (req: Request, res: Response, next: NextFunction) => {
    initializeCollections();

    const { bookingId } = req.params;
    const { startDate, endDate, charges } = req.body;

    if (!validateObjectId(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
    }

    if (!startDate || !endDate || charges === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedBooking = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            charges: Number(charges)
        };

        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: updatedBooking }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking updated successfully', updatedBooking });
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

export default router;
