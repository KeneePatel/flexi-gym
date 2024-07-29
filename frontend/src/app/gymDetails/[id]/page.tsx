"use client"
import { useState, useEffect, useRef } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BikeIcon, ChevronDownIcon, DumbbellIcon, LockIcon, MoonIcon, ShowerHeadIcon, StarIcon, TimerIcon } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import { useParams, useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"

export default function Component() {
    const params = useParams();
    const router = useRouter();
    const gymId = params.id;

    const [gymDetails, setGymDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(2);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    useEffect(() => {
        if (gymId) {
            const fetchGymDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/gyms/${gymId}`);
                    const data = await response.json();
                    setGymDetails(data);
                } catch (error) {
                    console.error("Error fetching gym details:", error);
                }
            };

            fetchGymDetails();
        }
    }, [gymId]);

    useEffect(() => {
        if (gymId) {
            const fetchReviews = async () => {
                try {
                    const reviewsResponse = await fetch(`http://localhost:5000/reviews/${gymId}?page=${page}&limit=${limit}`);
                    const reviewsData = await reviewsResponse.json();
                    console.log("reviewsData", reviewsData);
                    setReviews((prevReviews) => [...prevReviews, ...reviewsData.feedbacks]);
                    setTotalPages(reviewsData.totalPages);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                } finally {
                    setLoading(false);
                    console.log("reviews", reviews);
                }
            };

            fetchReviews();
        }
    }, [page, limit]);

    const handleShowMore = () => {
        setPage((prevPage) => prevPage + 1);
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            </div>
        );
    }

    if (!gymDetails) {
        return <div>Gym not found</div>;
    }

    const { images, name, tagline, about, amenities, hours, price, location, ratings } = gymDetails;
    const totalRatings = parseInt(ratings.totalRatings);
    const ratingCount = parseInt(ratings.count);
    const averageRating = (totalRatings / ratingCount).toFixed(1);

    const handleBookNow = () => {
        router.push(`/bookingConfirmation/${gymId}/new`);
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <Carousel className="rounded-lg overflow-hidden" plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                        <CarouselContent>
                            {images.map((src, index) => (
                                <CarouselItem key={index}>
                                    <img
                                        src={src}
                                        alt="Gym Image"
                                        width={800}
                                        height={500}
                                        className="object-cover w-full h-[400px]"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                    </Carousel>
                </div>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{name}</h1>
                        <p className="text-muted-foreground">{tagline}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, index) => (
                                <StarIcon key={index} className={`w-5 h-5 ${index < averageRating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`} />
                            ))}
                        </div>
                        <div className="text-lg font-semibold">{averageRating}</div>
                        <div className="text-sm text-muted-foreground">({ratingCount} reviews)</div>
                    </div>
                    <div className="grid gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">About</h2>
                            <p className="text-muted-foreground">{about}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Amenities</h2>
                            <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
                                {amenities.map((amenity, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        {(() => {
                                            switch (amenity) {
                                                case "Free weights":
                                                    return <DumbbellIcon className="w-5 h-5" />
                                                case "Stationary bikes":
                                                    return <BikeIcon className="w-5 h-5" />
                                                case "Showers":
                                                    return <ShowerHeadIcon className="w-5 h-5" />
                                                case "Treadmills":
                                                    return <TimerIcon className="w-5 h-5" />
                                                case "Yoga studio":
                                                    return <MoonIcon className="w-5 h-5" />
                                                case "Lockers":
                                                    return <LockIcon className="w-5 h-5" />
                                                default:
                                                    return null
                                            }
                                        })()}
                                        {amenity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Price</h2>
                                <div className="text-2xl font-bold">${price}/day</div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Hours</h2>
                                <div className="text-muted-foreground">
                                    {hours.map((hour, index) => (
                                        <div key={index}>{hour}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Location</h2>
                            <div className="text-muted-foreground">{location}</div>
                        </div>
                        <Button size="lg" className="w-full" onClick={handleBookNow}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
            <Separator className="my-8" />
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold [&[data-state=open]>svg]:rotate-180">
                        <div>User Reviews</div>
                        <ChevronDownIcon className="w-5 h-5 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="grid gap-6">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review._id} className="flex gap-4">
                                        <Avatar className="border">
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback>{review.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-semibold">{review.username}</div>
                                                <div className="flex items-center gap-0.5 text-xs font-semibold">
                                                    {Array.from({ length: 5 }, (_, index) => (
                                                        <StarIcon key={index} className={`w-4 h-4 ${index < review.rating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{new Date(review.updatedAt).toLocaleDateString()}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {review.comment}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No reviews yet</div>
                            )}
                        </div>
                        {page < totalPages && (
                            <Button className="w-full mt-4" onClick={handleShowMore}>
                                Show More
                            </Button>
                        )}
                    </CollapsibleContent>
                </Collapsible>

            </div>
        </div>
    )
}
