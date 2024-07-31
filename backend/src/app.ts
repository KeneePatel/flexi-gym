import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {connectDB} from './config/database';


import gymRouter from './routes/gyms';

import { PaymentController } from "./controllers/PaymentController";
import { BookingRepository } from "./repositories/BookingRepository";
import bookingsRouter from "./routes/bookings";
import { StripeService } from "./services/StripeService";

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
// app.use('/api/gyms', gymRouter);
app.post("/api/create-payment-intent", paymentController.createPaymentIntent);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
