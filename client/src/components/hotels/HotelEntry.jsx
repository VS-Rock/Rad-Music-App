import React from 'react';
import styled from 'styled-components';

const HotelDiv = styled.div`
  padding: 0.25em 1em;
  margin: 2em;
  border: 1px solid black;
  border-radius: 3px;
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
  const { hotel: { name, address, contact, rating }, offers } = lodge;
  return (
    <HotelDiv class-name="hotel-entry">
      <h5>{name}  -  {ratings[rating]}</h5>
      <p>
        {address.lines[0].split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' ')}
      </p>
      <p>
        {address.cityName.split(' ').map((word) => word[0] + word.slice(1).toLowerCase()).join(' ')}, {address.stateCode} 
      </p>
      <p>
        Contact: {contact.phone}
      </p>
      <p>
        ${offers[0].price.base} per night
      </p>
    </HotelDiv>
  )
}

export default HotelEntry;
