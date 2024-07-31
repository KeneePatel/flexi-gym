"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';
import Image from 'next/image';
import { useState, useEffect } from 'react';


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

    <div>
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
      <Button onClick={fetchGyms} disabled={loading}>
        {loading ? 'Loading...' : 'Search Gyms'}
      </Button>



      {/* Dropdown for sorting options using a more structured dropdown menu approach */}
      <DropdownMenu>
        <DropdownMenuTrigger id="dropdown-basic">Sort by: {sortOption}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sorting Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => handleSelect("Our top picks")}>Our top picks</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleSelect("Price (lowest first)")}>Price (lowest first)</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleSelect("Best reviewed and lowest price")}>Best reviewed and lowest price</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleSelect("Property rating (high to low)")}>Property rating (high to low)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <div div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        
        {gyms.length > 0 ? gyms.map(gym => (
          <Card key={gym._id} style={{ width: '18rem' }}>
            <CardHeader>
              <CardTitle>{gym.name}</CardTitle>
              <CardDescription>
                Ratings: {gym.ratings?.totalRatings || 'No'} stars ({gym.ratings?.count || 'no'} reviews)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image 
                src ={gym.images && gym.images[0]} alt={`${gym.name} image`}
                width={800}
                height={700} 
              />
              <p>About: {gym.about}</p>
            </CardContent>
            <CardFooter>
              <p>Price: ${gym.price}</p>
            </CardFooter>
          </Card>
        )) : <p>No gyms found</p>}
      </div>
    </div>

  </div>
  );
};

export default SearchGyms;