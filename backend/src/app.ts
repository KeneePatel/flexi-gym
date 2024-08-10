import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import totalBookings from "./routes/totalbookings";
import totalEarnings from "./routes/totalearnings";
import totalBookedUsers from "./routes/totalbookedusers";
import { connectDB } from "./config/database";
import gymRouter from "./routes/gyms";
import reviewsRouter from "./routes/reviews";
import cancelBooking from "./routes/cancelbooking"
import { PaymentController } from "./controllers/PaymentController";
import { BookingRepository } from "./repositories/BookingRepository";
import bookingsRouter from "./routes/bookings";
import { StripeService } from "./services/StripeService";
import monthlyBookings from "./routes/monthlybookings";
import monthlyEarnings from "./routes/monthlyearnings";
import advertisementRouter from "./routes/advertisements";

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
app.use("/cancelbooking", cancelBooking);
app.use("/totalEarnings", totalEarnings);
app.use("/totalBookedUsers", totalBookedUsers);
app.use("/monthlyEarnings", monthlyEarnings);
app.use("/monthlyBookings", monthlyBookings);
app.use("/api/gyms", gymRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/advertisements", advertisementRouter);
app.post("/api/create-payment-intent", paymentController.createPaymentIntent);
app.post("/api/create-booking", paymentController.createBooking);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
