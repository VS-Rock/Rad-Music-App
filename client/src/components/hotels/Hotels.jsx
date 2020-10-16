import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import HotelEntry from './HotelEntry';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState('');
  // const [isSearching, setIsSearching] = useState(false);
  // // const [searchStatus, setSearchStatus] = useState(false);

  const searchHotels = () => {
    // setIsSearching(true);
    axios.get('/api/hotels', { params: { city } })
      .then(results => {
        console.log(results);
        setHotels(results.data);
      })
      .catch(err => console.error(err));
    // setCity('');
    // setIsSearching(false);
  };

  return (
    <>
      <p>What city are you going to stay in?</p>
      <input type="text" placeholder="City" onChange={(e) => { setCity(e.target.value); }} />
      <Button onClick={searchHotels}>Search</Button>
      <div id="hotel-list" >
        {hotels.map((lodge) => <HotelEntry lodge={lodge} key={lodge.hotel.hotelId} />)}
      </div>
    </>
  );
};

export default Hotels;
