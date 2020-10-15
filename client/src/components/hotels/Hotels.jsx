import React, { useState } from 'react';
import axios from 'axios';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState('');

  const searchHotels = () => {
    console.log('you are searching for hotels in ', city);
    axios.get('/api/hotels', { params: { city } })
      .then(results => {
        console.log(results)
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <p>What city are you looking to stay in?</p>
      <input type="text" placeholder="City" onChange={(e) => { setCity(e.target.value); }} />
      <button onClick={searchHotels}>Search</button>
    </div>
  );
};

export default Hotels;
