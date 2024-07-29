import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';

const router = Router();

// Booking schema interface
interface Booking {
  _id?: ObjectId;
  gymName: string;
  location: string;
  date: string;
  amount: string;
  status: string;
}

// Get all bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const bookings = await db.collection<Booking>('bookings').find().toArray();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Insert a new booking
router.post('/', async (req: Request, res: Response) => {
  const { gymName, location, date, amount, status } = req.body as Booking;

  if (!gymName || !location || !date || !amount || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDB();
    const newBooking: Booking = { gymName, location, date, amount, status };

    const result = await db.collection('bookings').insertOne(newBooking);
    if (result.insertedId) {
      res.status(201).json({ message: 'Booking added successfully', booking: newBooking });
    } else {
      res.status(500).json({ message: 'Failed to add booking' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export default router;
