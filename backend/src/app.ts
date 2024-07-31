import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import totalBookings from './routes/totalbookings';
import totalEarnings from './routes/totalearnings';
import totalBookedUsers from './routes/totalbookedusers';
import {connectDB} from './config/database';
import gymRouter from './routes/gyms';
import { PaymentController } from "./controllers/PaymentController";
import { BookingRepository } from "./repositories/BookingRepository";
import bookingsRouter from "./routes/bookings";
import { StripeService } from "./services/StripeService";
import monthlyBookings from "./routes/monthlybookings";
import monthlyEarnings from "./routes/monthlyearnings";


dotenv.config();
connectDB();


const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet());
app.use(express.json());

// Connect to database
// connectDB();

// Dependency injectio
const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);
const bookingRepository = new BookingRepository();
const paymentController = new PaymentController(
  stripeService,
  bookingRepository,
);

// Routes (to be added later)
app.use("/api/bookings", bookingsRouter);
app.use("/totalBookings", totalBookings);
app.use("/totalEarnings", totalEarnings);
app.use("/totalBookedUsers", totalBookedUsers);
app.use("/monthlyEarnings", monthlyEarnings);
app.use("/monthlyBookings", monthlyBookings);
app.use('/api/gyms', gymRouter);
app.post("/api/create-payment-intent", paymentController.createPaymentIntent);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
