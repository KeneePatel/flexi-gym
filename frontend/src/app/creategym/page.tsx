"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProtectedRoute from '../../../Auth/ProtectedRoutes';
import { GET_GYM } from "../../Constants/EndPoints";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfileData } from '../../../Auth/AuthService';

interface LoggedInUser {
    firstName?: string;
    lastName?: string;
    gymName?: string;
    type?: string;
    email?: string;
    id?: string;
}

function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

export default function GymPage() {
    const router = useRouter();
    const [name, setName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [tagline, setTagline] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [amenities, setAmenities] = useState<string[]>([]);
    const [weekdayHours, setWeekdayHours] = useState<string>("");
    const [weekendHours, setWeekendHours] = useState<string>("");
    const [price, setPrice] = useState<number | undefined>();
    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [errors, setErrors] = useState({
        name: false,
        title: false,
        street: false,
        city: false,
        country: false,
        price: false
    });

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const userProfile = await getProfileData();
                if (userProfile) {
                    // @ts-ignore
                    setLoggedInUser(userProfile);
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            }
        };

        loadProfileData();
    }, []);

    const addAmenity = () => {
        setAmenities([...amenities, ""]);
    };

    const removeAmenity = (index: number) => {
        const updatedAmenities = [...amenities];
        updatedAmenities.splice(index, 1);
        setAmenities(updatedAmenities);
    };

    const updateAmenity = (index: number, value: string) => {
        const updatedAmenities = [...amenities];
        updatedAmenities[index] = value;
        setAmenities(updatedAmenities);
    };
    const handleFileChange = (e: { target: { files: Iterable<unknown> | ArrayLike<unknown>; }; }) => {
        const files = Array.from(e.target.files);
        const promises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file as Blob);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        });

        // @ts-ignore
        Promise.all(promises)
            .then(base64Files => setImages(base64Files))
            .catch(error => console.error('Error converting files to base64:', error));
    };


    const validateForm = () => {
        const newErrors = {
            name: !name,
            title: !title,
            street: !street,
            city: !city,
            country: !country,
            price: price === undefined || isNaN(price) || price <= 0
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = {
            name,
            location: {
                street,
                city,
                country,
            },
            amenities,
            title,
            tagline,
            hours: [
                weekdayHours,
                weekendHours
            ],
            price: Number(price),
            userId: loggedInUser?.id,
            images
        };

        try {
            const response = await fetch(GET_GYM, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast.success('Gym listing added successfully.');

                setTimeout(() => {
                    // @ts-ignore
                    router.push('/gymOwnerDashboard');
                }, 2000);
            } else {
                toast.error('Error saving gym details.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ProtectedRoute>
            <div className="w-full max-w-3xl mx-auto m-5">
                <Card className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Add New Gym</CardTitle>
                        <CardDescription>Fill out your gym details for a new listing.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                            <section className="grid gap-4">
                                <h2 className="text-xl font-semibold">General Information</h2>
                                <div className="grid gap-3">
                                    <div className="grid gap-1">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Gym Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Flexi Gym"
                                            className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs">Gym Name is required.</p>}
                                    </div>
                                    <div className="grid gap-1">
                                        <Label htmlFor="title" className="text-sm font-medium">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Fitness for everyone"
                                            className={`w-full ${errors.title ? 'border-red-500' : ''}`}
                                        />
                                        {errors.title && <p className="text-red-500 text-xs">Title is required.</p>}
                                    </div>
                                    <div className="grid gap-1">
                                        <Label htmlFor="tagline" className="text-sm font-medium">
                                            Tagline
                                        </Label>
                                        <Input
                                            id="tagline"
                                            value={tagline}
                                            onChange={(e) => setTagline(e.target.value)}
                                            placeholder="Add your gym tagline"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="grid gap-4">
                                <h2 className="text-xl font-semibold">Location</h2>
                                <div className="grid gap-3">
                                    <div className="grid gap-1">
                                        <Label htmlFor="address" className="text-sm font-medium">
                                            Street
                                        </Label>
                                        <Input
                                            id="address"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            placeholder="Robie Street"
                                            className={`w-full ${errors.street ? 'border-red-500' : ''}`}
                                        />
                                        {errors.street && <p className="text-red-500 text-xs">Street is required.</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-1">
                                            <Label htmlFor="city" className="text-sm font-medium">
                                                City
                                            </Label>
                                            <Input
                                                id="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="Halifax"
                                                className={`w-full ${errors.city ? 'border-red-500' : ''}`}
                                            />
                                            {errors.city && <p className="text-red-500 text-xs">City is required.</p>}
                                        </div>
                                        <div className="grid gap-1">
                                            <Label htmlFor="country" className="text-sm font-medium">
                                                Country
                                            </Label>
                                            <Input
                                                id="country"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                placeholder="Canada"
                                                className={`w-full ${errors.country ? 'border-red-500' : ''}`}
                                            />
                                            {errors.country &&
                                                <p className="text-red-500 text-xs">Country is required.</p>}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="grid gap-4">
                                <h2 className="text-xl font-semibold">Amenities</h2>
                                <div className="grid gap-2">
                                    {amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={amenity}
                                                onChange={(e) => updateAmenity(index, e.target.value)}
                                                placeholder="Amenity"
                                                className="w-full"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => removeAmenity(index)}
                                                className="text-red-500 hover:bg-red-500 hover:text-white"
                                            >
                                                <XIcon className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" onClick={addAmenity}>Add Amenity</Button>
                                </div>
                            </section>

                            <section className="grid gap-4">
                                <h2 className="text-xl font-semibold">Hours & Pricing</h2>
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-1">
                                            <Label htmlFor="weekday-hours" className="text-sm font-medium">
                                                Weekday Hours
                                            </Label>
                                            <Input
                                                id="weekday-hours"
                                                value={weekdayHours}
                                                onChange={(e) => setWeekdayHours(e.target.value)}
                                                placeholder="Monday - Friday: 6am - 10pm"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label htmlFor="weekend-hours" className="text-sm font-medium">
                                                Weekend Hours
                                            </Label>
                                            <Input
                                                id="weekend-hours"
                                                value={weekendHours}
                                                onChange={(e) => setWeekendHours(e.target.value)}
                                                placeholder="Saturday - Sunday: 8am - 8pm"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <Label htmlFor="price" className="text-sm font-medium">
                                            Price
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            placeholder="$10 per day"
                                            className={`w-full ${errors.price ? 'border-red-500' : ''}`}
                                        />
                                        {errors.price && <p className="text-red-500 text-xs">Price is required.</p>}
                                    </div>
                                </div>
                            </section>
                            <section className="grid gap-4">
                                <h2 className="text-xl font-semibold">Upload Images</h2>
                                <div className="grid gap-3">
                                    <div className="grid gap-1">
                                        <Label htmlFor="images" className="text-sm font-medium">
                                            Images
                                        </Label>
                                        <Input
                                            id="images"
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </section>
                            <CardFooter>
                                <div className="flex justify-end">
                                    <Button type="submit">Save Listing</Button>
                                </div>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
                <ToastContainer/>
            </div>
        </ProtectedRoute>
    );
}
