import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/database";
import gymRouter from "./routes/gyms";
import reviewsRouter from "./routes/reviews";
import totalBookedUsers from "./routes/totalbookedusers";
import totalBookings from "./routes/totalbookings";
import totalEarnings from "./routes/totalearnings";

import { PaymentController } from "./controllers/PaymentController";
import { BookingRepository } from "./repositories/BookingRepository";
import bookingsRouter from "./routes/bookings";
import monthlyBookings from "./routes/monthlybookings";
import monthlyEarnings from "./routes/monthlyearnings";
import { EmailService } from "./services/EmailService";
import { StripeService } from "./services/StripeService";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet());
app.use(express.json());

// Connect to database
// connectDB();

// Dependency injection
const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);
const emailService = new EmailService();
emailService.startReminderJob();
const bookingRepository = new BookingRepository();
const paymentController = new PaymentController(
  stripeService,
  emailService,
  bookingRepository,
);

// Routes (to be added later)
app.use("/api/bookings", bookingsRouter);
app.use("/totalBookings", totalBookings);
app.use("/totalEarnings", totalEarnings);
app.use("/totalBookedUsers", totalBookedUsers);
app.use("/monthlyEarnings", monthlyEarnings);
app.use("/monthlyBookings", monthlyBookings);
app.use("/api/gyms", gymRouter);
app.use("/api/reviews", reviewsRouter);
app.post("/api/create-payment-intent", paymentController.createPaymentIntent);
app.post("/api/create-booking", paymentController.createBooking);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
