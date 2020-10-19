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
      "lon":lon,
      "units":"imperial"
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