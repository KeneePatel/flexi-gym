import nodemailer from "nodemailer";
import cron from "node-cron";
import { getDB } from '../config/database';
import { ObjectId } from 'mongodb';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: false,
      
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendBookingConfirmation(userId: string, bookingDetails: any): Promise<void> {
    const userEmail = await this.getUserEmail(userId);
    
    console.log(`sending email to ${userEmail}`);

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail ?? "",
      subject: "Booking Confirmation",
      text: `Your booking has been confirmed! Details: ${JSON.stringify(bookingDetails)}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendReminderEmail(to: string, bookingDetails: any): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: "Booking Reminder",
      text: `Your booking is coming up in 24 hours! Details: ${JSON.stringify(bookingDetails)}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async getBookings24HrsAway(): Promise<any[]> {
    const db = getDB();
    const bookingsCollection = db.collection('bookings');
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return await bookingsCollection.find({
      startDate: {
        $gte: now.toISOString(),
        $lt: in24Hours.toISOString(),
      },
    }).toArray();
  }

  async getUserEmail(userId: string): Promise<string | null> {
    const db = getDB();
    const user = await db.collection('userprofiles').findOne({ _id: new ObjectId(userId) });
    return user ? user.email : null;
  }

  startReminderJob() {
    cron.schedule('0 * * * *', async () => {
      console.log('Running the reminder job');
      const bookings = await this.getBookings24HrsAway();
      for (const booking of bookings) {
        const userEmail = await this.getUserEmail(booking.userId);
        if (userEmail) {
          await this.sendReminderEmail(userEmail, booking);
        }
      }
    });
  }
}