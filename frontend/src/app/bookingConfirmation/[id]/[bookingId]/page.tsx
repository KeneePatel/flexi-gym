// "use client"
//
// import { useState, useEffect, useRef } from 'react'
// import { Card } from "@/components/ui/card"
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { CalendarIcon, StarIcon } from "lucide-react"
// import Autoplay from "embla-carousel-autoplay"
// import { useParams } from 'next/navigation'
// import { Skeleton } from "@/components/ui/skeleton"
//
// // Helper function to normalize dates to midnight
// const normalizeDate = (date: Date) => {
//     const normalizedDate = new Date(date)
//     normalizedDate.setHours(0, 0, 0, 0)
//     return normalizedDate
// }
//
// export default function Component() {
//
//     const params = useParams();
//     console.log("params", params);
//     const gymId = params.id;
//
//     const [gymDetails, setGymDetails] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const plugin = useRef(
//         Autoplay({ delay: 2000, stopOnInteraction: true })
//     )
//
//     useEffect(() => {
//         if (gymId) {
//             const fetchData = async () => {
//                 try {
//                     const response = await fetch(`http://localhost:5000/gyms/${gymId}`);
//                     const data = await response.json();
//                     setGymDetails(data);
//                     setTotalPrice(data.price);
//                 } catch (error) {
//                     console.error("Error fetching gym details:", error);
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//             fetchData();
//         }
//     }, [gymId]);
//
//
//     const [startDate, setStartDate] = useState<Date | undefined>(new Date())
//     const [endDate, setEndDate] = useState<Date | undefined>(new Date())
//     const [totalDays, setTotalDays] = useState<number | undefined>(1)
//     const [totalPrice, setTotalPrice] = useState<number>(0) // Base price per day
//
//     // Handle start date change
//     const handleStartDateChange = (date: Date | undefined) => {
//         if (date && endDate && normalizeDate(date) > normalizeDate(endDate)) {
//             setEndDate(undefined) // Clear end date if it's before the new start date
//         }
//         setStartDate(date)
//         updateTotalDays(date, endDate)
//     }
//
//     // Handle end date change
//     const handleEndDateChange = (date: Date | undefined) => {
//         setEndDate(date)
//         updateTotalDays(startDate, date)
//     }
//
//     // Calculate the total number of days between start and end date
//     const updateTotalDays = (start: Date | undefined, end: Date | undefined) => {
//         if (start && end) {
//             // Normalize dates
//             const normalizedStart = normalizeDate(start)
//             const normalizedEnd = normalizeDate(end)
//
//             console.log("normalized date", normalizedStart)
//             // Ensure end date is not before start date
//             if (normalizedEnd < normalizedStart) {
//                 console.error('End date cannot be before start date')
//                 return
//             }
//
//             // Calculate the difference in time
//             const diffTime = normalizedEnd.getTime() - normalizedStart.getTime()
//             // Calculate the difference in days and add 1 to include the end date
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
//
//             // Update the state with total days and price
//             setTotalDays(diffDays)
//             setTotalPrice(diffDays * price) // Update price based on total days
//         } else {
//             // Reset the state if dates are not selected
//             setTotalDays(undefined)
//             setTotalPrice(price) // Reset price if no dates are selected
//         }
//     }
//
//     if (loading) {
//         return (<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="grid lg:grid-cols-2 gap-8">
//                 <div className="flex flex-col space-y-3">
//                     <Skeleton className="h-[400px] w-full rounded-xl" />
//                 </div>
//                 <div className="space-y-6">
//                     <Skeleton className="h-8 w-1/3 rounded-md" />
//                     <Skeleton className="h-6 w-1/2 rounded-md" />
//                     <Skeleton className="h-6 w-1/4 rounded-md" />
//                     <div className="space-y-2">
//                         <Skeleton className="h-6 w-1/3 rounded-md" />
//                         <Skeleton className="h-6 w-full" />
//                         <Skeleton className="h-6 w-full" />
//                     </div>
//                     <Skeleton className="h-6 w-1/4 rounded-md" />
//                     <Skeleton className="h-6 w-full rounded-md" />
//                 </div>
//             </div>
//         </div>);
//     }
//
//     if (!gymDetails) {
//         return <div>Gym not found</div>;
//     }
//
//     // Check if both start and end dates are selected
//     const isButtonDisabled = !startDate || !endDate
//     const { images, name, tagline, about, amenities, hours, price, location, ratings } = gymDetails;
//     const totalRatings = parseInt(ratings.totalRatings);
//     const ratingCount = parseInt(ratings.count);
//     const averageRating = (totalRatings / ratingCount).toFixed(1);
//     // setTotalPrice(price);
//
//     return (
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <Card className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 items-start">
//                 <div className="relative overflow-hidden rounded-lg">
//                     <img
//                         src={images[0]}
//                         alt="Gym image"
//                         width={300}
//                         height={400}
//                         className="object-cover w-full aspect-[3/4]"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
//                     <div className="absolute bottom-4 left-4 text-white">
//                         <div className="flex items-center gap-2">
//                             <div className="flex items-center gap-0.5">
//                                 {Array.from({ length: 5 }, (_, index) => (
//                                     <StarIcon key={index} className={`w-5 h-5 ${index < averageRating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`} />
//                                 ))}
//                             </div>
//                             <span className="text-sm font-medium">{averageRating}</span>
//                         </div>
//                         <h3 className="text-xl font-bold">{name}</h3>
//                     </div>
//                 </div>
//                 <div className="grid gap-4">
//                     <div className="flex items-center justify-between">
//                         <div className="grid gap-1">
//                             <h3 className="text-2xl font-bold">{name}</h3>
//                             <div className="flex items-center gap-2 text-sm">
//                                 <div className="flex items-center gap-0.5">
//                                     {Array.from({ length: 5 }, (_, index) => (
//                                         <StarIcon key={index} className={`w-5 h-5 ${index < averageRating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`} />
//                                     ))}
//                                 </div>
//                                 <span>{averageRating}</span>
//                             </div>
//                         </div>
//                         <div className="text-2xl font-bold">${totalPrice}</div>
//                     </div>
//                     <div className="grid gap-2">
//                         <div className="flex items-center gap-2">
//                             <CalendarIcon className="w-5 h-5 text-muted-foreground" />
//                             <Popover>
//                                 <PopoverTrigger asChild>
//                                     <Button variant="outline" className="flex-col items-start w-full h-auto">
//                                         <span className="font-semibold uppercase text-[0.65rem]">Start</span>
//                                         <span className="font-normal">{startDate ? startDate.toLocaleDateString() : 'Select date'}</span>
//                                     </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="p-0 max-w-[276px]">
//                                     <Calendar
//                                         mode="single"
//                                         selected={startDate}
//                                         onSelect={handleStartDateChange}
//                                         disabled={(date) => {
//                                             const today = new Date()
//                                             // Normalize today's date
//                                             const normalizedToday = normalizeDate(today)
//                                             // Ensure today's date is selectable
//                                             const isPastDate = normalizeDate(date) < normalizedToday
//                                             const isFutureDate = normalizeDate(date) > new Date("2025-01-01")
//                                             return isPastDate || isFutureDate
//                                         }}
//                                         className="rounded-md border"
//                                         initialFocus
//                                     />
//                                 </PopoverContent>
//                             </Popover>
//                             <Popover>
//                                 <PopoverTrigger asChild>
//                                     <Button variant="outline" className="flex-col items-start w-full h-auto">
//                                         <span className="font-semibold uppercase text-[0.65rem]">End</span>
//                                         <span className="font-normal">{endDate ? endDate.toLocaleDateString() : 'Select date'}</span>
//                                     </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="p-0 max-w-[276px]">
//                                     <Calendar
//                                         mode="single"
//                                         selected={endDate}
//                                         onSelect={handleEndDateChange}
//                                         disabled={(date) => {
//                                             // Use normalized start date for comparison
//                                             const normalizedStartDate = normalizeDate(startDate || new Date())
//                                             // Ensure today's date is selectable
//                                             const isPastDate = normalizeDate(date) < normalizedStartDate
//                                             const isFutureDate = normalizeDate(date) > new Date("2025-01-01")
//                                             return isPastDate || isFutureDate
//                                         }}
//                                         className="rounded-md border"
//                                         initialFocus
//                                     />
//                                 </PopoverContent>
//                             </Popover>
//                         </div>
//                         {totalDays !== undefined && (
//                             <div className="text-sm text-muted-foreground">Total days: {totalDays}</div>
//                         )}
//                         <div className="text-sm text-muted-foreground">Price may vary based on selected dates</div>
//                     </div>
//                     <Button size="lg" className="w-full" disabled={isButtonDisabled}>
//                         Book Now
//                     </Button>
//                 </div>
//             </Card>
//         </div>
//     )
// }
