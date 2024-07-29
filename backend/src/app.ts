import express from 'express';
import { connectDB } from '../config/db';
import gymRoutes from '../routes/gyms';
import reviewRoutes from '../routes/reviews';
import bookingRoutes from '../routes/bookings'; 
import cors from 'cors';

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/gyms', gymRoutes);
app.use('/reviews', reviewRoutes);
app.use('/bookings', bookingRoutes); 
app.use(cors());

app.listen(port, () => {
  return console.log(`http://localhost:${port}`);
});
