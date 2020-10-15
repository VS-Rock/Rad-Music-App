require('dotenv').config();
const axios = require('axios');
const { Router } = require('express');

const Hotels = Router();

Hotels.get('/', (req, res) => {
  const { city } = req.query;
  console.log('city:', city);
  const cityCodeConfig = {
    method: 'get',
    url: `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}`,
    headers: {
      'Authorization': `Bearer ${process.env.AMADEUS_TOKEN}`
    },
  };
  axios(cityCodeConfig)
    .then(response => {
      const cityCode = response.data.data[0].iataCode;
    });
  res.send('Hello from hotel route!');
})

module.exports = {
  Hotels,
};
