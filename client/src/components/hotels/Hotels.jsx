import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import HotelEntry from './HotelEntry';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [shownHotels, setShownHotels] = useState([]);
  const [city, setCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchHotels = (event) => {
    event.preventDefault();
    console.log('you are searching for hotels in:', city);
    setIsSearching(true);
    axios.get('/api/hotels', { params: { city } })
      .then((results) => {
        setHotels(results.data);
        setShownHotels(results.data.sort((a, b) => {
          return a.offers[0].price.base - b.offers[0].price.base;
        }));
      })
      .then(() => setIsSearching(false))
      .catch(err => console.error(err));
    event.target.reset();
  };

  const filterResults = (value) => {
    if (value === 'lowToHigh') {
      setShownHotels(hotels.slice().sort((a, b) => {
        return a.offers[0].price.base - b.offers[0].price.base;
      }));
    } else if (value === 'highToLow') {
      setShownHotels(hotels.slice().sort((a, b) => {
        return b.offers[0].price.base - a.offers[0].price.base;
      }));
    } else if (value === 'highest-rated') {
      setShownHotels(hotels.slice().sort((a, b) => b.hotel.rating - a.hotel.rating));
    } else {
      setShownHotels(hotels.filter((hotel) => hotel.hotel.rating >= 4))
    }
  }

  return (
    <>
      {/* <p>What city are you going to stay in?</p> */}
      <form onSubmit={(e) => {searchHotels(e)}}>
        <label htmlFor="city">What city are you going to stay in?</label>
        <br></br>
        <input type="text" placeholder="City" onChange={(e) => { setCity(e.target.value); }} />
        <input type="submit" value="Search" />
      </form>
      {shownHotels.length > 0
        && (
        <div>
          <br></br>
          <label htmlFor="sort" >Sort by:</label>
          <select name="sort" id="sort" onChange={(e) => { filterResults(e.target.value); }}>
            <optgroup label="Price">
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </optgroup>
            <optgroup label="By Rating">
              <option value="highest-rated">Highest Rated</option>
              <option value="4-and-up">Only 4 Stars and Above</option>
            </optgroup>
          </select>
        </div>
        )
      }
      <div id="hotel-list" >
        {isSearching 
          ? (
            <div>
              <br></br>
              <p><b>Searching for hotels. This may take a few moments.</b></p>
            </div>
          )
          : shownHotels.map((lodge) => <HotelEntry lodge={lodge} key={lodge.hotel.hotelId} />)
        }
      </div>
    </>
  );
};

export default Hotels;
