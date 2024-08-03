import { Collection, Db, ObjectId } from "mongodb";
import { connectDB, getDB } from "../config/database";

interface Booking {
  _id: ObjectId;
  userId: string;
  gymId: string;
  startDate: string;
  endDate: string;
  charges: number;
}

export interface CreateBookingRequest {
  userId: string;
  gymId: string;
  startDate: string;
  endDate: string;
  charges: number;
}

export class BookingRepository {
  async createBooking(bookingReq: CreateBookingRequest): Promise<Boolean> {
    await connectDB();
    const database = getDB();
    const bookingsCollection = database.collection<Booking>("bookings");

    try {
      const newBooking: Booking = {
        _id: new ObjectId(),
        userId: bookingReq.userId,
        gymId: bookingReq.gymId,
        startDate: bookingReq.startDate,
        endDate: bookingReq.endDate,
        charges: bookingReq.charges,
      };
      await bookingsCollection.insertOne(newBooking);
      return true;
    } catch (error) {
      console.error("Error creating booking:", error);
      return false;
    }
  }
}
