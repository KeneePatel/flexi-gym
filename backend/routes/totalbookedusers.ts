import { Router, Request, Response } from 'express';
import { ObjectId } from 'bson';
import { getDB } from '../config/db';
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
    const userIds = bookings.map(booking => new ObjectId(booking.userId));
    const users = await db.collection('users').find({ _id: { $in: userIds } }).toArray();

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
