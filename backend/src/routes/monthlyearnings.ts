import { Router, Request, Response } from 'express';
import { ObjectId } from 'bson';
import { getDB } from '../config/database';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const gym = await db.collection('gyms').findOne({ _id: new ObjectId(id) });

    if (!gym) {
      return res.status(404).json({ message: 'Cannot find gym' });
    }

    const bookings = await db.collection('bookings').find({ gymId: id }).toArray();

    const monthlyEarnings = Array(12).fill(0);

    bookings.forEach(booking => {
      const month = new Date(booking.startDate).getMonth();
      const charges = parseFloat(booking.charges.replace('$', ''));
      monthlyEarnings[month] += charges;
    });

    res.json(monthlyEarnings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
