import express from 'express';
import dashboardRoutes from '../routes/dashboard';
import totalBookings from '../routes/totalbookings';
import totalEarnings from '../routes/totalearnings';
import totalBookedUsers from '../routes/totalbookedusers';


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

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/gyms', gymRoutes);
app.use('/reviews', reviewRoutes);
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
