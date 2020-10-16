require('dotenv').config();
const axios = require('axios');
const { Router } = require('express');

const Hotels = Router();

Hotels.get('/', (req, res) => {
  const { city } = req.query;
  const cityCodeConfig = {
    method: 'get',
    url: `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}`,
    headers: {
      Authorization: `Bearer ${process.env.AMADEUS_TOKEN}`
    },
  };
  axios(cityCodeConfig)
    .then((response) => response.data.data[0].iataCode)
    .then((cityCode) => {
      console.log('searching from city code', cityCode);
      axios({
        method: 'get',
        url: `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${cityCode}`,
        headers: { 
          Authorization: `Bearer ${process.env.AMADEUS_TOKEN}`
        },
      })
        .then(results => { 
          console.log('initial results.data searching by cityCode:', results.data);
          if (results.data.data.length > 0) {
            res.send(results.data.data) 
          } else {
            console.log('no hotels found. doing third amadeus call now.');
            console.log('link being sent:', results.data.meta.links.next);
            axios({
              method: 'get',
              url: results.data.meta.links.next,
              headers: { 
                Authorization: `Bearer ${process.env.AMADEUS_TOKEN}`
              }
            })
              .then(results => {
                res.send(results.data.data);
              });
          }
        });
    })
    .catch((err) => console.error(err));
})

module.exports = {
  Hotels,
};
