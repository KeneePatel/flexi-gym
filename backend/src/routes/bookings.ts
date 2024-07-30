import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, ObjectId, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

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
}

interface Gym {
    _id: ObjectId;
    name: string;
    location: string;
}

// Use a connection pool
let database: Db;
let bookingsCollection: Collection<Booking>;
let gymsCollection: Collection<Gym>;

(async () => {
    try {
        await client.connect();
        database = client.db('FlexiGym');
        bookingsCollection = database.collection<Booking>('bookings');
        gymsCollection = database.collection<Gym>('gyms');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
})();

const validateObjectId = (id: string): boolean => {
    return ObjectId.isValid(id);
};

router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    console.log("userId", userId)
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
        console.log("bookings", bookings);

        const bookingsWithGymDetails = await Promise.all(
            bookings.map(async (booking) => {
                const gym = await gymsCollection.findOne({ _id: new ObjectId(booking.gymId) });
                console.log("gym", gym);
                console.log("booking", booking);

                return {
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    charges: booking.charges,
                    gymName: gym?.name,
                    gymLocation: gym?.location,
                };
            })
        );

        res.json({
            currentPage: page,
            // totalItems: await bookingsCollection.countDocuments({ userId: userId }),
            items: bookingsWithGymDetails,
        });
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
  