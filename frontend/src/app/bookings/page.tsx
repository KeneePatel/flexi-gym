/*
 * File: bookings.ts
 * Author: Jeet Jani <jeet@dal.ca>
 * Date: 2024-07-30
 * Description: Booking list.
 */
'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../Auth/ProtectedRoutes';

interface Booking {
  startDate: string;
  endDate: string;
  charges: number | string;
  gymName: string;
  gymLocation: string;
  _id: string;
  gymId: string;
  gym: any;
}

export default function Component() {
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/user/66a8129ffa48505c5ed80597`);
        const data = await response.json();

        const now = new Date();
        const current = data.items.filter((booking: Booking) => new Date(booking.endDate) > now);
        const past = data.items.filter((booking: Booking) => new Date(booking.endDate) <= now);

        setCurrentBookings(current);
        setPastBookings(past);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatLocation = (location: { street: string; city: string; country: string; coordinates: [number, number] }) => {
    return `${location.street}, ${location.city}, ${location.country}`;
  };

  const formatCharges = (charges: number | string) => {
    if (typeof charges === 'number') {
      return `$${charges.toFixed(2)}`;
    }
    return `$${charges}`;
  };
  const handleUpdate = (bookingId: string, gymId: string) => {
    router.push(`/bookingConfirmation/${gymId}/${bookingId}`);
  }

  return (
      <ProtectedRoute>
    <div className="container mx-auto px-6 py-8 sm:px-8 lg:px-10">
      <h1 className="text-2xl font-bold mb-6">Booking History</h1>
      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Current Bookings</h2>
          <div className="grid gap-6">
            {currentBookings && currentBookings.map((booking, index) => (
              <Card key={index} className="grid grid-cols-[1fr_120px] gap-6 px-4 py-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">{booking.gym.name}</h3>
                  <p className="text-muted-foreground">{formatLocation(booking.gym.location)}</p>
                  <p className="text-muted-foreground">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p className="font-medium">{formatCharges(booking.charges)}</p>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" onClick={()=>handleUpdate(booking._id, booking.gym._id)}>
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
            {pastBookings && pastBookings.map((booking, index) => (
              <Card key={index} className="grid grid-cols-[1fr_120px] gap-6 px-4 py-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">{booking.gymName}</h3>
                  <p className="text-muted-foreground">{booking.gymLocation}</p>
                  <p className="text-muted-foreground">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </p>
                  <p className="font-medium">{formatCharges(booking.charges)}</p>
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
      </ProtectedRoute>
  );
}
