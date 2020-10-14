import React, { useState } from 'react';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState('');

  const searchHotels = () => {
    console.log('you are searching for hotels in ', city);
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
