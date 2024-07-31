"use client"

import { useState, useEffect, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, StarIcon } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import { useParams, useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function Component() {
    const params = useParams();
    const gymId = params.id;
    const bookingId = params.bookingId;
    const router = useRouter();

    const [gymDetails, setGymDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())
    const [totalDays, setTotalDays] = useState<number | undefined>(1)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [dialogOpen, setDialogOpen] = useState(false)
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (gymId) {
                    console.log(bookingId);
                    const gymResponse = await fetch(`http://localhost:8080/api/gyms/${gymId}`);
                    const gymData = await gymResponse.json();
                    setGymDetails(gymData);
                    setTotalPrice(gymData.price); // Set initial price
                }

                if (bookingId && bookingId !== 'new') {
                    console.log(`is new? ${bookingId && bookingId !== 'new'}`);
                    const bookingResponse = await fetch(`http://localhost:8080/api/bookings/${bookingId}`);
                    const bookingData = await bookingResponse.json();
                    console.log("start date", bookingData.startDate);
                    setStartDate(new Date(bookingData.startDate));
                    setEndDate(new Date(bookingData.endDate));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [gymId, bookingId]);

    useEffect(() => {
        if (gymDetails) {
            updateTotalDays(startDate, endDate);
        }
    }, [gymDetails, startDate, endDate]);

    const handleStartDateChange = (date: Date | undefined) => {
        if (date && endDate && normalizeDate(date) > normalizeDate(endDate)) {
            setEndDate(undefined)
        }
        setStartDate(date)
    }

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date)
    }

    const updateTotalDays = (start: Date | undefined, end: Date | undefined) => {
        if (start && end && gymDetails) {
            const normalizedStart = normalizeDate(start);
            const normalizedEnd = normalizeDate(end);

            if (normalizedEnd < normalizedStart) {
                console.error('End date cannot be before start date');
                return;
            }

            const diffTime = normalizedEnd.getTime() - normalizedStart.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

            setTotalDays(diffDays);
            setTotalPrice(diffDays * gymDetails.price);
        } else if (gymDetails) {
            setTotalDays(undefined);
            setTotalPrice(gymDetails.price);
        }
    }

    const handleDelete = async () => {
        try {
            if (bookingId) {
                await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                    method: 'DELETE',
                });
                // Handle any UI updates or redirections here
                console.log('Booking deleted successfully');
                router.push(`/bookings`);
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
        } finally {
            setDialogOpen(false);
        }
    }

    const handleCheckout = () => {
        console.log("gymId", gymId);
        const query = new URLSearchParams({
            gymId: gymId,
            startDate: startDate?.toISOString() || '',
            endDate: endDate?.toISOString() || '',
            charges: totalPrice.toString()
        }).toString();

        router.push(`/checkout?${query}`);
    }

    const handleReschedule = async () => {
        try {
            if (bookingId && startDate && endDate) {
                const updatedBooking = {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    charges: totalPrice
                };

                await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedBooking),
                });

                console.log('Booking rescheduled successfully');
                router.push(`/bookings`); // Redirect to bookings page or wherever appropriate
            }
        } catch (error) {
            console.error('Error rescheduling booking:', error);
        }
    };


    if (loading) {
        return (<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-8 w-1/3 rounded-md" />
                    <Skeleton className="h-6 w-1/2 rounded-md" />
                    <Skeleton className="h-6 w-1/4 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-1/3 rounded-md" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                    <Skeleton className="h-6 w-1/4 rounded-md" />
                    <Skeleton className="h-6 w-full rounded-md" />
                </div>
            </div>
        </div>);
    }

    if (!gymDetails) {
        return <div>Gym not found</div>;
    }

    const isButtonDisabled = !startDate || !endDate
    const { images, name, tagline, about, amenities, hours, price, location, ratings } = gymDetails;
    const totalRatings = parseInt(ratings.totalRatings);
    const ratingCount = parseInt(ratings.count);
    const averageRating = (totalRatings / ratingCount).toFixed(1);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 items-start">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={images[0]}
                        alt="Gym image"
                        width={300}
                        height={400}
                        className="object-cover w-full aspect-[3/4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <StarIcon key={index} className={`w-5 h-5 ${index < averageRating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{averageRating}</span>
                        </div>
                        <h3 className="text-xl font-bold">{name}</h3>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                            <h3 className="text-2xl font-bold">{name}</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <StarIcon key={index} className={`w-5 h-5 ${index < averageRating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`} />
                                    ))}
                                </div>
                                <span>{averageRating}</span>
                            </div>
                        </div>
                        {bookingId === 'new' && (
                            <div className="text-2xl font-bold">${totalPrice}</div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="flex-col items-start w-full h-auto">
                                        <span className="font-semibold uppercase text-[0.65rem]">Start</span>
                                        <span className="font-normal">
                                            {startDate ? startDate.toLocaleDateString(undefined, { timeZone: 'UTC' }) : 'Select date'}
                                        </span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 max-w-[276px]">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={handleStartDateChange}
                                        disabled={(date) => {
                                            const today = new Date()
                                            const normalizedToday = normalizeDate(today)
                                            const isPastDate = normalizeDate(date) < normalizedToday
                                            const isFutureDate = normalizeDate(date) > new Date("2025-01-01")
                                            return isPastDate || isFutureDate
                                        }}
                                        className="rounded-md border"
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="flex-col items-start w-full h-auto">
                                        <span className="font-semibold uppercase text-[0.65rem]">End</span>
                                        <span className="font-normal">
                                            {endDate ? endDate.toLocaleDateString(undefined, { timeZone: 'UTC' }) : 'Select date'}
                                        </span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 max-w-[276px]">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={handleEndDateChange}
                                        disabled={(date) => {
                                            const normalizedStartDate = normalizeDate(startDate || new Date())
                                            const isPastDate = normalizeDate(date) < normalizedStartDate
                                            const isFutureDate = normalizeDate(date) > new Date("2025-01-01")
                                            return isPastDate || isFutureDate
                                        }}
                                        className="rounded-md border"
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        {totalDays !== undefined && (
                            <div className="text-sm text-muted-foreground">Total days: {totalDays}</div>
                        )}
                        {bookingId === 'new' && (
                            <div className="text-sm text-muted-foreground">Price may vary based on selected dates</div>
                        )}
                        {bookingId !== 'new' && (
                            <div className="text-sm text-muted-foreground">If you decide to reschedule, an agent will reach out to you shortly to provide information on any adjustments to the fee.</div>
                        )}
                    </div>
                    {
                        bookingId &&
                        bookingId !== 'new' &&
                        (
                            <div className='flex gap-4'>
                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" variant="destructive" className="w-full">Delete Booking</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Confirm Deletion</DialogTitle>
                                        <p>Are you sure you want to delete this booking?</p>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full">No</Button>
                                            <Button variant="destructive" onClick={handleDelete} className="w-full">Yes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button size="lg" className="w-full" disabled={isButtonDisabled} onClick={handleReschedule}>
                                    Reschedule
                                </Button>
                            </div>
                        )
                    }
                    {
                        bookingId &&
                        bookingId === 'new' &&
                        <Button size="lg" className="w-full" disabled={isButtonDisabled} onClick={handleCheckout}>
                            Proceed to checkout
                        </Button>
                    }
                </div>
            </Card>
        </div>
    )
}