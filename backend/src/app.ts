import express from 'express';
import { connectDB } from '../config/db';
import gymRoutes from '../routes/gyms'; 
import reviewRoutes from '../routes/reviews'; 
import dashboardRoutes from '../routes/dashboard';
import totalBookings from '../routes/totalbookings';
import totalEarnings from '../routes/totalearnings';
import totalBookedUsers from '../routes/totalbookedusers';


import cors from 'cors';

const app = express();
const port = 5000;
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

connectDB();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/gyms', gymRoutes);
app.use('/reviews', reviewRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/totalBookings', totalBookings);
app.use('/totalEarnings', totalEarnings);
app.use('/totalBookedUsers', totalBookedUsers);



app.listen(port, () => {
  return console.log(`http://localhost:${port}`);
});