import React from 'react';
import styled from 'styled-components';

const HotelDiv = styled.div`
  padding: 0.25em 1em;
  margin: 2em;
  background: #eee;
  border: 1px solid #777;
  border-radius: 4px;
  :hover {
    webkit-box-shadow: 4px 4px 2px 0px rgba(128,128,128,0.75);
    moz-box-shadow: 4px 4px 2px 0px rgba(128,128,128,0.75);
    box-shadow: 4px 4px 2px 0px rgba(128,128,128,0.75);
  }
`;

const ratings = [
  '☆☆☆☆☆',
  '★☆☆☆☆',
  '★★☆☆☆',
  '★★★☆☆',
  '★★★★☆',
  '★★★★★',
];

const HotelEntry = ({ lodge }) => {
  const { hotel: { name, address, contact: { phone }, rating }, offers } = lodge;
  const { lines, cityName, stateCode } = address;

  return (
    <HotelDiv class-name="hotel-entry">
      <h5>{name}  -  {ratings[rating]}</h5>
      <p>
        {lines[0].split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' ')}
      </p>
      <p>
        {cityName.split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' ')}, {stateCode} 
      </p>
      <p>
        Contact: {phone}
      </p>
      <p>
        ${offers[0].price.base} per night
      </p>
    </HotelDiv>
  )
}

export default HotelEntry;
