/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const { Router } = require('express');
const axios = require('axios');

const {
  Show, Band, ShowsBands, Genre,
} = require('../db/index');

const Shows = Router();
const getWeatherData = (lat, lon) => axios({
  method: 'GET',
  url: 'https://community-open-weather-map.p.rapidapi.com/weather',
  headers: {
    'content-type': 'application/octet-stream',
    'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
    'x-rapidapi-key': process.env.WEATHER_API_KEY,
    useQueryString: true,
  },
  params: {
    lat,
    lon,
    units: 'imperial',
  },
})
  .then(({ data }) => data)
  .catch((error) => {
    console.log(error);
  });
// responds to "search by band" requests
Shows.get('/band', async (req, res) => {
  const { query } = req.query;
  let genre;
  // response that will be eventually sent back
  const resp = [];
  // find band id
  const bandId = await Band.findOne({
    where: { bandName: query },
  })
    .then(async (band) => {
      // if band exists, use genreId from band table to get name of genre
      if (band) {
        genre = await Genre.findOne({
          where: {
            id: band.dataValues.genreId,
          },
        })
          .then((foundGenre) => foundGenre.dataValues.genreName);
        // return bandId
        return band.dataValues.id;
      }
      throw band;
    });
  // use bandId to find all shows they will play in
  await ShowsBands.findAll({
    where: {
      bandId,
    },
  })
    .then(async (foundShowsBands) => {
      // loop through list of shows retrieved from join table
      for (let i = 0; i < foundShowsBands.length; i++) {
        // get showId for each show
        const { showId } = foundShowsBands[i].dataValues;
        // use showId to query show table and get info on individual shows
        const showInfoMaybe = await Show.findOne({
          where: {
            id: showId,
          },
        })
          .then((something) => ({
            // take each show and place relevant info in an object
            bandName: query,
            genre,
            date: something.dataValues.date,
            venue: something.dataValues.venue,
            lat: something.dataValues.lat,
            lng: something.dataValues.lng,
            details: something.dataValues.details,
          }));
        // push object of show info into response array created about
        resp.push(showInfoMaybe);
      }
    });
  // send array of shows back to client
  res.send(resp);
});

// responds to "search by venue" requests
Shows.get('/venue', async (req, res) => {
  const { query } = req.query;
  // response that will be eventually sent back
  const resp = [];
  // find all shows in show table occurring at desired venue
  await Show.findAll({
    where: {
      venue: query,
    },
  })
    .then(async (shows) => {
      // loop through list of found shows
      for (let i = 0; i < shows.length; i++) {
        const {
          venue, date, details, lat, lng,
        } = shows[i].dataValues;
        await ShowsBands.findAll({
          where: {
            showId: shows[i].dataValues.id,
          },
        })
          .then(async (found) => {
            // loop through lists of matches
            for (let j = 0; j < found.length; j++) {
              // query band table using bandId value from join table
              const band = await Band.findOne({
                where: {
                  id: found[j].dataValues.bandId,
                },
              })
                .then(async (something) => {
                  // grab genre and band name from matching band
                  const { bandName, genreId } = something.dataValues;
                  // grab genre name from genre table
                  const genre = await Genre.findOne({
                    where: {
                      id: genreId,
                    },
                  })
                    .then((foundGenre) => foundGenre.dataValues.genreName);
                  // return object of relevant info.
                  // note that all of this info was not found in query to band table
                  return ({
                    bandName,
                    genre,
                    venue,
                    date,
                    details,
                    lat,
                    lng,
                  });
                });
              // push relevant info into response array
              resp.push(band);
            }
          });
      }
    });
  // send relevant info back to client
  res.send(resp);
});

// responds to "search by date" requests
Shows.get('/date', async (req, res) => {
  const { query } = req.query;
  // response that will be eventually sent back
  const resp = [];
  // query Show table to find shows matching requested date
  await Show.findAll({
    where: {
      date: query,
    },
  })
    .then(async (shows) => {
      // loop through list of matching shows
      for (let i = 0; i < shows.length; i++) {
        const {
          venue, date, details, lat, lng,
        } = shows[i].dataValues;
        await ShowsBands.findAll({
          where: {
            showId: shows[i].dataValues.id,
          },
        })
          .then(async (found) => {
            // loop through list of matching shows from join table
            for (let j = 0; j < found.length; j++) {
              // query band table using bandId
              const band = await Band.findOne({
                where: {
                  id: found[j].dataValues.bandId,
                },
              })
                .then(async (something) => {
                  // grab band name and genre id from result
                  const { bandName, genreId } = something.dataValues;
                  // get genre name from genre table
                  const genre = await Genre.findOne({
                    where: {
                      id: genreId,
                    },
                  })
                    .then((foundGenre) => foundGenre.dataValues.genreName);
                  // return object of relevant info
                  return ({
                    bandName,
                    genre,
                    venue,
                    date,
                    details,
                    lat,
                    lng,
                  });
                });
              // push relevant info into response array
              resp.push(band);
            }
          });
      }
    });
  // send relevant info back to client
  res.send(resp);
});

// responds to "search by genre" requests
Shows.get('/genre', async (req, res) => {
  const { genre } = req.query;
  // response that will be eventually sent back
  let resp = [];
  // get genreId from genre table
  const genreId = await Genre.findOne({
    where: {
      genreName: genre,
    },
  })
    .then((foundGenre) => foundGenre.dataValues.id);
  // use genreId to find all matching bands
  await Band.findAll({
    where: { genreId },
  })
    .then(async (band) => {
      // if any matching band is found, loop through array of matches
      if (band) {
        for (let i = 0; i < band.length; i++) {
          const { bandName } = band[i].dataValues;
          const bandId = band[i].dataValues.id;
          // search showsBands join table using band id
          await ShowsBands.findAll({
            where: {
              bandId,
            },
          })
            .then(async (foundShowsBands) => {
              // loop through array of matches
              for (let i = 0; i < foundShowsBands.length; i++) {
                const { showId } = foundShowsBands[i].dataValues;
                // query Shows table using showId
                const showInfoMaybe = await Show.findOne({
                  where: {
                    id: showId,
                  },
                })
                  // place relevant show info into an object
                  .then((something) => ({
                    bandName,
                    genre,
                    date: something.dataValues.date,
                    venue: something.dataValues.venue,
                    lat: something.dataValues.lat,
                    lng: something.dataValues.lng,
                    details: something.dataValues.details,
                  }));
                // push relevant show info into response object
                resp.push(showInfoMaybe);
              }
            });
        }
      // throw error if no matches are found
      } else {
        throw band;
      }
    })
    // set response to empty array if no matches are found
    .catch((band) => {
      resp = [];
    });
  // send response back to client
  res.send(resp);
});

// responds to post requests AKA adding new shows
Shows.post('/', async (req, res) => {
  // get variables from req
  const {
    bandName,
    venue,
    date,
    details,
    genre,
    lat,
    lng,
  } = req.body;
  // get genreId from genre DB
  const genreId = await Genre.findOne({
    where: {
      genreName: genre,
    },
  })
    .then((genreInfo) => genreInfo.dataValues.id);
  // query show DB using venue and date
  const showId = await Show.findOne({
    where: {
      venue,
      date,
    },
  })
    .then(async (show) => {
      // if that show already exists, return the id
      if (show) {
        return show.dataValues.id;
      }
      // if show doesnt exist yet, create it
      const newShow = await Show.create({
        venue,
        date,
        details,
        genreId,
        lat,
        lng,
      });
      // return new show id
      return newShow.id;
    });
  // query band DB using band name
  const bandId = await Band.findOne({
    where: {
      bandName,
    },
  })
    .then(async (band) => {
      // if that band exists, return its id
      if (band) {
        return band.dataValues.id;
      }
      // if band doesn't exist, create it
      const newBand = await Band.create({
        bandName,
        genreId,
      });
      // return new band id
      return newBand.id;
    });
  // check if band/show combo already exists
  await ShowsBands.findOne({
    where: {
      bandId,
      showId,
    },
  })
    .then(async (showBand) => {
      // if combo doesn't exist, create it
      if (!showBand) {
        await ShowsBands.create({
          bandId,
          showId,
        });
        // console.log('show created');
      } else {
        // console.log('show already exists');
        res.status(409).send('ALREADY IN DATABASE');
      }
    });
});

// responds to "search by id" requests
Shows.get('/:showId', (req, res) => {
  const showInfo = {};
  const { showId } = req.params;
  showInfo.showId = showId;
  // response that will be eventually sent back
  const resp = [];
  // find band id
  ShowsBands.findOne({
    where: { showId },
  })
    .then((show_band) => {
      showInfo.bandId = show_band.dataValues.bandId;
      Band.findOne({
        where: { id: showInfo.bandId },
      })
        .then((band) => {
          showInfo.bandName = band.dataValues.bandName;
          showInfo.genreId = band.dataValues.genreId;
          Show.findOne({
            where: { id: showId },
          })
            .then((show) => {
              showInfo.venue = show.dataValues.venue;
              showInfo.date = show.dataValues.date;
              showInfo.lat = show.dataValues.lat;
              showInfo.lng = show.dataValues.lng;
              showInfo.details = show.dataValues.details;
              //
              axios({
                method: 'GET',
                url: 'https://community-open-weather-map.p.rapidapi.com/weather',
                headers: {
                  'content-type': 'application/octet-stream',
                  'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
                  'x-rapidapi-key': process.env.WEATHER_API_KEY,
                  useQueryString: true,
                },
                params: {
                  lat: showInfo.lat,
                  lon: showInfo.lng,
                  units: 'imperial',
                },
              })
                .then(({ data }) => {
                // console.log('weatherInfo', data)
                  showInfo.temp = `${data.main.temp}°F`;
                  showInfo.weather = data.weather[0].main;
                  showInfo.icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                  res.send(showInfo);
                });
            });
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    });
});

module.exports = {
  Shows,
};
