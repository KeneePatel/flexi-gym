/*
 * File: page.tsx
 * Author: Harsh Mehta <harsh.mehta@dal.ca>
 * Date: 2024-07-30
 * Description: Use for displaying gym details.
 */

"use client";
import { useState, useEffect, useRef } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    BikeIcon,
    ChevronDownIcon,
    DumbbellIcon,
    LockIcon,
    MoonIcon,
    ShowerHeadIcon,
    StarIcon,
    TimerIcon,
    EditIcon,
    TrashIcon,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProtectedRoute from '../../../../Auth/ProtectedRoutes';
import { getProfileData } from "../../../../Auth/AuthService";
import httpFetch from "@/lib/httpFetch";
import { GET_GYM, GET_REVIEWS } from "@/Constants/EndPoints";

export default function Component() {
    const params = useParams();
    const router = useRouter();
    const gymId = params.id;
    const user = getProfileData();
    const [gymDetails, setGymDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "", username: "", userid: "" });
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
    const [deleteReviewId, setDeleteReviewId] = useState(null);
    useEffect(() => {
        if (gymId) {
            const fetchGymDetails = async () => {
                try {
                    const response = await httpFetch(`${GET_GYM}/${gymId}`);
                    const data = await response.json();
                    setGymDetails(data);
                } catch (error) {
                    console.error("Error fetching gym details:", error);
                }
            };

            fetchGymDetails();
        }
    }, [reviews]);

    useEffect(() => {
        console.log("userData", user);

        if (gymId) {
            const fetchReviews = async () => {
                try {
                    const reviewsResponse = await httpFetch(
                        `${GET_REVIEWS}/${gymId}?page=${page}&limit=${limit}`
                    );
                    const reviewsData = await reviewsResponse.json();
                    setReviews((prevReviews) => [
                        ...prevReviews,
                        ...reviewsData.feedbacks,
                    ]);
                    setTotalPages(reviewsData.totalPages);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchReviews();
        }
    }, [page]);

    const handleShowMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleAddReview = async () => {
        try {
            const username = user.firstName + " "+ user.lastName;
            const response = await httpFetch(GET_REVIEWS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newReview,
                    gymid: gymId,
                    username: username,
                    userid: user.id,
                    updatedDate: new Date().toISOString(),
                }),
            });
            newReview.username = username;
            newReview.userid = user.id;
            if (response.ok) {
                setReviews((prevReviews) => [newReview, ...prevReviews]);
                setNewReview({ rating: 0, comment: "", username: user.firstName + " "+ user.lastName, userid: user.id });
            }
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const handleEditReview = async () => {
        try {
            console.log("handle edit", editingReview);
            const response = await httpFetch(
                `${GET_REVIEWS}/${editingReview._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editingReview),
                }
            );
            if (response.ok) {
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review._id === editingReview._id ? editingReview : review
                    )
                );
                setEditingReview(null);
            }
        } catch (error) {
            console.error("Error editing review:", error);
        }
    };

    const handleDeleteReview = async () => {
        try {
            const response = await httpFetch(
                `${GET_REVIEWS}/${deleteReviewId}`,
                {
                    method: "DELETE",
                }
            );
            if (response.ok) {
                setReviews((prevReviews) =>
                    prevReviews.filter((review) => review._id !== deleteReviewId)
                );
                setDeleteReviewId(null);
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

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

    const {
        images,
        name,
        tagline,
        about,
        amenities,
        hours,
        price,
        location,
        ratings,
    } = gymDetails;
    const totalRatings = parseInt(ratings.totalRatings);
    const ratingCount = parseInt(ratings.count);
    const averageRating = (totalRatings / ratingCount).toFixed(1);

    const handleBookNow = () => {
        router.push(`/bookingConfirmation/${gymId}/new`);
    };

    return (
        <ProtectedRoute>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <Carousel
                        className="rounded-lg overflow-hidden"
                        plugins={[plugin.current]}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
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
                                <StarIcon
                                    key={index}
                                    className={`w-5 h-5 ${index < averageRating
                                        ? "fill-primary"
                                        : "fill-muted stroke-muted-foreground"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="text-lg font-semibold">{averageRating}</div>
                        <div className="text-sm text-muted-foreground">
                            ({ratingCount} reviews)
                        </div>
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
                                                    return <DumbbellIcon className="w-5 h-5" />;
                                                case "Stationary bikes":
                                                    return <BikeIcon className="w-5 h-5" />;
                                                case "Showers":
                                                    return <ShowerHeadIcon className="w-5 h-5" />;
                                                case "Treadmills":
                                                    return <TimerIcon className="w-5 h-5" />;
                                                case "Yoga studio":
                                                    return <MoonIcon className="w-5 h-5" />;
                                                case "Lockers":
                                                    return <LockIcon className="w-5 h-5" />;
                                                default:
                                                    return null;
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
                            <div className="text-muted-foreground">{location.city}</div>
                        </div>
                        <Button size="lg" className="w-full" onClick={handleBookNow}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
            <Separator className="my-8" />
            <div>
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="border p-4 rounded-lg relative">
                                <div className="absolute top-2 right-2 flex gap-2">
                                    {review.userid === user.id && review._id &&(
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingReview(review)}
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteReviewId(review._id)}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Avatar className="border">
                                        <AvatarFallback>{review.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{review.username}</p>
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <StarIcon
                                                    key={index}
                                                    className={`w-4 h-4 ${index < review.rating
                                                        ? "fill-primary"
                                                        : "fill-muted stroke-muted-foreground"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2">{review.comment}</p>
                            </div>
                        ))}
                        {page < totalPages && (
                            <Button onClick={handleShowMore} variant="outline">
                                Show More
                            </Button>
                        )}
                    </div>
                ) : (
                    <p>No reviews yet.</p>
                )}
                <Dialog
                    open={Boolean(deleteReviewId)}
                    onOpenChange={() => setDeleteReviewId(null)}
                >
                    <DialogContent>
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this review?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setDeleteReviewId(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteReview}>
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Separator className="my-8" />
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Add a Review</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }, (_, index) => (
                            <StarIcon
                                key={index}
                                className={`w-6 h-6 cursor-pointer ${index < newReview.rating
                                    ? "fill-primary"
                                    : "fill-muted stroke-muted-foreground"
                                    }`}
                                onClick={() =>
                                    setNewReview((prev) => ({ ...prev, rating: index + 1 }))
                                }
                            />
                        ))}
                    </div>
                    <Label htmlFor="comment">Comment</Label>
                    <Input
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) =>
                            setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                        }
                    />
                    <Button onClick={handleAddReview}>Submit Review</Button>
                </div>
            </div>

            <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
                <DialogContent>
                    <h2 className="text-xl font-semibold">Edit Review</h2>
                    {editingReview && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={`w-6 h-6 cursor-pointer ${index < editingReview.rating
                                            ? "fill-primary"
                                            : "fill-muted stroke-muted-foreground"
                                            }`}
                                        onClick={() =>
                                            setEditingReview((prev) => ({
                                                ...prev,
                                                rating: index + 1,
                                            }))
                                        }
                                    />
                                ))}
                            </div>
                            <Label htmlFor="edit-comment">Comment</Label>
                            <Input
                                id="edit-comment"
                                value={editingReview.comment}
                                onChange={(e) =>
                                    setEditingReview((prev) => ({
                                        ...prev,
                                        comment: e.target.value,
                                    }))
                                }
                            />
                            <Button onClick={handleEditReview}>Save Changes</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
        </ProtectedRoute>
    );
}
