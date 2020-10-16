require('dotenv').config();
const axios = require('axios');
const { Router } = require('express');
const { User, Show } = require('../db/index');

//need to specify route? or pick diff?
//this works, but is for current weather
const getWeatherData = (lat, lon) => {
  return axios({
      "method":"GET",
      "url":"https://community-open-weather-map.p.rapidapi.com/weather",
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"community-open-weather-map.p.rapidapi.com",
      "x-rapidapi-key":process.env.WEATHER_API_KEY,
      "useQueryString":true
      },"params":{
      "lat":lat,
      "lon":lon
      }
      })
      .then(({ data })=>{
        return data;
      })
      .catch((error)=>{
        console.log(error)
      })
};


const Weather = Router();

  // get weather for specific time and location
  // make two different routes for weather axios call, one for less than five, one for greater than? can probably sort that back end
  // so only need one call? and just need to send the relevant data. might be tricky as get. maybe post. sending data afterall?
  Weather.post('/forecast', (req, res) => {
    const {
      lat, lon, date
    } = req.body;
    getWeatherData(lat, lon)
    
    .then((weatherData) => {
      res.send(weatherData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  })




module.exports = {
  Weather,
};