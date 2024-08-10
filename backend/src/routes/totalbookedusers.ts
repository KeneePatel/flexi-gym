import { Router, Request, Response } from 'express';
import { ObjectId } from 'bson';
import { getDB } from '../config/database';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    
    // Check if the gym exists in the 'userprofiles' collection
    const gym = await db.collection('userprofiles').findOne({ _id: new ObjectId(req.params.id) });

    if (!gym) {
      // If not found in 'userprofiles', check the 'gyms' collection
      const gym1 = await db.collection('gyms').findOne({ _id: new ObjectId(req.params.id) });
      if (!gym1) {
        return res.status(404).json({ message: 'Cannot find gym' });
      }
    }

    // Fetch only bookings with status="succeeded"
    const bookings = await db.collection('bookings').find({
      gymId: req.params.id,
      status: "succeeded" // Filter for bookings with status="succeeded"
    }).toArray();

    // Extract user IDs and their corresponding booking IDs
    const userBookings = bookings.map(booking => ({
      userId: new ObjectId(booking.userId),
      bookingId: booking._id // Include booking ID in the response
    }));

    // Get the unique user IDs
    const userIds = Array.from(new Set(userBookings.map(ub => ub.userId)));

    // Fetch user profiles for these IDs
    const users = await db.collection('userprofiles').find({ _id: { $in: userIds } }).toArray();

    // Map users to their respective booking IDs
    const usersWithBookingIds = users.map(user => {
      const userBookingIds = userBookings.filter(ub => ub.userId.equals(user._id)).map(ub => ub.bookingId);
      return {
        ...user,
        bookingIds: userBookingIds // Include the booking IDs for each user
      };
    });

    res.json({ users: usersWithBookingIds });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
