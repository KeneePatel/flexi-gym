import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/database';
import { count } from 'console';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const gym = await db.collection('gyms').findOne({ _id: new ObjectId(req.params.id) });

    if (!gym) {
      return res.status(404).json({ message: 'Cannot find gym' });
    }

    const bookings = await db.collection('bookings').find({ gymId: req.params.id }).toArray();
    const totalBookingAmount = bookings.reduce((total, booking) => {
      // Remove the $ sign and parse the number
      const amount = parseInt(booking.charges.replace('$', ''), 10);
      return total + amount;
    }, 0);

    res.json(totalBookingAmount );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
