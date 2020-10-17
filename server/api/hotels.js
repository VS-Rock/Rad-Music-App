require('dotenv').config();
const axios = require('axios');
const { Router } = require('express');
const qs = require('qs');

const Hotels = Router();

const tokenData = qs.stringify({
  grant_type: process.env.GRANT_TYPE,
  client_id: process.env.AMADEUS_CLIENT_ID,
  client_secret: process.env.AMADEUS_CLIENT_SECRET,
});

const tokenConfig = {
  method: 'post',
  url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: tokenData
};

Hotels.get('/', (req, res) => {
  const { city } = req.query;
  let bearerToken = '';
  axios(tokenConfig)
    .then((results) => {
      bearerToken = results.data.access_token;
    })
    .then(() => {
      axios({
        method: 'get',
        url: `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}`,
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
        .then((response) => response.data.data[0].iataCode)
        .then((cityCode) => {
          axios({
            method: 'get',
            url: `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${cityCode}`,
            headers: { 
              Authorization: `Bearer ${bearerToken}`
            },
          })
            .then((results) => { 
              if (results.data.data.length > 0) {
                res.send(results.data.data) 
              } else {
                axios({
                  method: 'get',
                  url: results.data.meta.links.next,
                  headers: { 
                    Authorization: `Bearer ${bearerToken}`
                  }
                })
                  .then((results) => {
                    res.send(results.data.data);
                  });
              }
            });
        })
    })
    .catch((err) => console.error(err));
})

module.exports = {
  Hotels,
};
