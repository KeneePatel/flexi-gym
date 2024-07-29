import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { count } from 'console';

const router = Router();

// Get all feedbacks with provided gymid with pagination
router.get('/:gymid', async (req: Request, res: Response) => {
    const { gymid } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        const db = getDB();
        const feedbacks = await db.collection('feedback')
            .find({ gymid: new ObjectId(gymid) })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        const totalFeedbacks = await db.collection('feedback').countDocuments({ gymid: new ObjectId(gymid) });

        res.status(200).json({
            feedbacks,
            totalPages: Math.ceil(totalFeedbacks / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Insert feedback and update gym ratings
router.post('/', async (req: Request, res: Response) => {
    const { username, userid, updatedDate, gymid, rating, comment } = req.body;

    if (!username || !userid || !updatedDate || !gymid || !rating || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = getDB();
        const feedbackCollection = db.collection('feedback');
        const gymCollection = db.collection('gyms');

        const newFeedback = {
            username,
            userid,
            updatedDate: new Date(updatedDate),
            gymid: new ObjectId(gymid),
            rating,
            comment
        };

        const result = await feedbackCollection.insertOne(newFeedback);
        console.log("insert", result);
        if (result.insertedId) {
            const filter = { _id: new ObjectId(gymid) };
            // const updateDoc = {
            //     $inc: {
            //         ratings: {
            //             count
            //         },
            //         two: req.inpute
            //     }
            // }
            await gymCollection.updateOne(
                filter,
                {
                    $inc: { 'ratings.count': 1, 'ratings.totalRatings': rating }
                }
            );

            res.status(201).json({ message: 'Feedback added successfully' });
        } else {
            res.status(500).json({ message: 'Failed to add feedback' });
        }
    } catch (error) {
        console.log("error", error);

        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

export default router;
