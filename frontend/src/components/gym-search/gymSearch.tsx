"use client"

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { StarIcon } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from 'react';

type sortOptionType = "Our top picks" | "Price (lowest first)" | "Best reviewed" | "Property rating (high to low)"

const SearchGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('Our top picks');

  const fetchGyms = async () => {
    setLoading(true);
    const payload = {
      name: searchTerm,
      city, // Use city for location search
      sortOption // Include sort option in the payload
    };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/gyms/search`, payload);
      setGyms(response.data);
    } catch (error) {
      console.error('Error fetching gyms:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSelect = (eventKey) => {
    setSortOption(eventKey);
    fetchGyms(); // Fetch gyms immediately when sort option changes
  };

  useEffect(() => {
    fetchGyms();
  }, [sortOption, searchTerm, city]); // Fetch gyms when these dependencies change

  return (

    <div style={{ marginTop: '30px' }}>

      <div className="flex flex-col gap-4 p-4 mx-4">
        <div className="flex flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search gyms by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">{sortOption}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sorting Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleSelect("Our top picks")}>Our top picks</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect("Price (lowest first)")}>Price (lowest first)</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect("Best reviewed and lowest price")}>Best reviewed and lowest price</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect("Property rating (high to low)")}>Property rating (high to low)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>

        {gyms.length > 0 ? gyms.map(gym => (
          <div
            key={gym._id}
            className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
          >
            <Link href={`/gymDetails/${gym._id}`} className="absolute inset-0 z-10" prefetch={false}>
              <span className="sr-only">View</span>
            </Link>
            <img src={gym.images[0]} alt={gym.name} width={400} height={300} className="object-cover w-full h-64" />
            <div className="p-4 bg-background">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{gym.name}</h3>
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  <StarIcon className="w-4 h-4 fill-primary" />
                  {gym.ratings?.count > 0 ? (gym.ratings.totalRatings / gym.ratings.count).toFixed(1) : 0}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{gym.location.street}, {gym.location.city}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-semibold">${gym.price}/day</p>
                <Button variant="outline" size="sm">
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )) : <p>No gyms found</p>}
      </div>
    </div>

  );
};

export default SearchGyms;