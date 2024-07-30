// Add the "use client" directive at the top
'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define a TypeScript interface for the booking data
interface Booking {
  _id: string;
  gymName: string;
  location: string;
  date: string;
  amount: string;
  status: string;
}

export default function Component() {
  // State to store bookings
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Update the URL to include the port number
        const response = await fetch('http://localhost:5001/api/bookings');
        const data: Booking[] = await response.json(); // Specify the type of the data

        // Split bookings into upcoming and past
        const now = new Date();
        const upcoming = data.filter(booking => new Date(booking.date) > now);
        const past = data.filter(booking => new Date(booking.date) <= now);

        setUpcomingBookings(upcoming);
        setPastBookings(past);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="container mx-auto px-6 py-8 sm:px-8 lg:px-10">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>
      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
          <div className="grid gap-6">
            {upcomingBookings.map((booking) => (
              <Card key={booking._id} className="grid grid-cols-[1fr_120px] gap-6 px-4 py-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">{booking.gymName}</h3>
                  <p className="text-muted-foreground">{booking.location}</p>
                  <p className="text-muted-foreground">{booking.date}</p>
                  <p className="font-medium">{booking.amount}</p>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
          <div className="grid gap-6">
            {pastBookings.map((booking) => (
              <Card key={booking._id} className="grid grid-cols-[1fr_120px] gap-6 px-4 py-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">{booking.gymName}</h3>
                  <p className="text-muted-foreground">{booking.location}</p>
                  <p className="text-muted-foreground">{booking.date}</p>
                  <p className="font-medium">{booking.amount}</p>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm">
                    Rate
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
