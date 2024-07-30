import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';

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
            .sort({ updatedDate: -1 })
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
        if (result.insertedId) {
            const filter = { _id: new ObjectId(gymid) };
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
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Update feedback and update gym ratings
router.put('/:feedbackid', async (req: Request, res: Response) => {
    const { feedbackid } = req.params;
    const { username, userid, updatedDate, rating, comment } = req.body;

    if (!username || !userid || !updatedDate || !rating || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = getDB();
        const feedbackCollection = db.collection('feedback');
        const gymCollection = db.collection('gyms');

        const feedback = await feedbackCollection.findOne({ _id: new ObjectId(feedbackid) });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        const ratingDifference = rating - feedback.rating;

        const updatedFeedback = {
            username,
            userid,
            updatedDate: new Date(updatedDate),
            rating,
            comment
        };

        const result = await feedbackCollection.updateOne(
            { _id: new ObjectId(feedbackid) },
            { $set: updatedFeedback }
        );

        if (result.modifiedCount > 0) {
            const filter = { _id: new ObjectId(feedback.gymid) };
            await gymCollection.updateOne(
                filter,
                {
                    $inc: { 'ratings.totalRatings': ratingDifference }
                }
            );

            res.status(200).json({ message: 'Feedback updated successfully' });
        } else {
            res.status(500).json({ message: 'Failed to update feedback' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Delete feedback and update gym ratings
router.delete('/:feedbackid', async (req: Request, res: Response) => {
    const { feedbackid } = req.params;

    try {
        const db = getDB();
        const feedbackCollection = db.collection('feedback');
        const gymCollection = db.collection('gyms');

        const feedback = await feedbackCollection.findOne({ _id: new ObjectId(feedbackid) });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        const result = await feedbackCollection.deleteOne({ _id: new ObjectId(feedbackid) });
        if (result.deletedCount > 0) {
            const filter = { _id: new ObjectId(feedback.gymid) };
            await gymCollection.updateOne(
                filter,
                {
                    $inc: { 'ratings.count': -1, 'ratings.totalRatings': -feedback.rating }
                }
            );

            res.status(200).json({ message: 'Feedback deleted successfully' });
        } else {
            res.status(500).json({ message: 'Failed to delete feedback' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

export default router;
