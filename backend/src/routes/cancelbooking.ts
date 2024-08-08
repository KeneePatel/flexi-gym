import { Router, Request, Response } from 'express';
import { ObjectId } from 'bson';
import { getDB } from '../config/database';

const router = Router();

router.get('/:bookingId', async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const { bookingId } = req.params;

    // Validate the booking ID
    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Update the status of the booking to "cancelled"
    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: 'cancelled' } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking status updated to cancelled' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
