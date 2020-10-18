import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import HotelEntry from './HotelEntry';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [shownHotels, setShownHotels] = useState([]);
  const [city, setCity] = useState('');

  const searchHotels = () => {
    axios.get('/api/hotels', { params: { city } })
      .then(results => {
        setHotels(() => results.data);
        setShownHotels(results.data.sort((a, b) => {
          return a.offers[0].price.base - b.offers[0].price.base;
        }));
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <p>What city are you going to stay in?</p>
      <input type="text" placeholder="City" onChange={(e) => { setCity(e.target.value); }} />
      <Button onClick={searchHotels}>Search</Button>
      <div id="hotel-list" >
        {shownHotels.map((lodge) => <HotelEntry lodge={lodge} key={lodge.hotel.hotelId} />)}
      </div>
    </>
  );
};

export default Hotels;
