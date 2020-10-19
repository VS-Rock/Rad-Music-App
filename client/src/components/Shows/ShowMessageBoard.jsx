import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import Axios from 'axios';
import {
  Container, Row, Col, Card, Button,
} from 'react-bootstrap';
import { Divider } from 'antd';
import { bottom } from '@popperjs/core';
import mapStyles from '../Add/styles';
import Messages from '../Messages/Messages';
import { LandingInfo, LandingVenue } from '../Landing/LandingInfo';

const libraries = ['places'];
const mapContainerStyle = {
  width: '45vh',
  height: '45vh',
};
const center = {
  lat: 38.6270,
  lng: -90.0663,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const ShowMessageBoard = ({ user, genre }) => {
  /** NEED: showId to pass to messages component */
  // start with id 2?
  // make a button to cycle through shows? maybe 'random show'?
  const [showID, setShowID] = useState(2); // show id goes here
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapReference = useRef();
  const onMapLoad = useCallback((map) => {
    mapReference.current = map;
  }, []);
  const test = [];
  const [favoriteGenre, setFavoriteGenre] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bandNameState, setBandNameState] = useState('');
  const [venueState, setVenueState] = useState('');
  const [genreState, setGenreState] = useState('');
  const [detailsState, setDetailsState] = useState('');
  const [dateState, setDateState] = useState('');
  const [iconState, setIconState] = useState('http://openweathermap.org/img/wn/10d@2x.png');
  const [weatherState, setWeatherState] = useState('');
  const [tempState, setTempState] = useState('');

  const getShow = () => {
    const showId = showID;
    Axios.get(`/api/shows/${showId}`)
      .then(({ data }) => {
        // console.log('data', data)
        const {
          lat,
          lng,
          bandName,
          venue,
          details,
          date,
          icon,
          weather,
          temp,
        } = data;

        test.push({
          lat: Number(lat), lng: Number(lng), bandName, venue, genre, details, date, icon, weather, temp,
        });
        setFavoriteGenre(test);
        setVenueState(venue);
        setBandNameState(bandName);
        setGenreState(genre);
        setDetailsState(details);
        setDateState(date);
        setIconState(icon);
        setWeatherState(weather);
        setTempState(temp);
      });
  };
  const cycleShow = () => {
    let num = showID;
    if (num < 4) {
      num += 1;
    } else {
      num = 1;
    }
    setShowID(num);
    getShow();
  };
  useEffect(() => {
    getShow();
  }, []);
  if (loadError) return 'ERROR LOADING MAPS';
  if (!isLoaded) return 'LOADING MAPS';

  return (
    <Container>
      <div style={{
      }}
      >
        <div style={{
          float: 'left',
          padding: '10px',
        }}
        />

      </div>
      <Row>
        <Col>
          <div
            className="card"
            style={{
              height: '45vh',
              float: bottom,
            }}
          >
            <h3>{bandNameState}</h3>
            <h4>{venueState}</h4>
            <p>{dateState}</p>
            <p>{detailsState}</p>
            <h5>Forecast:</h5>
            <Row md="auto">
              <h6 className="temp">{tempState}</h6>
              <span />
              <h6 className="weather">{weatherState}</h6>
            </Row>
            <img src={iconState} />
            <Row>
              <Button variant="secondary" block onClick={cycleShow}>See Another Show</Button>
            </Row>
            {' '}
          </div>
        </Col>
        <Col>
          <div
            className="showMap"
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={3}
              center={center}
              options={options}
              onLoad={onMapLoad}
            >
              {favoriteGenre.map((marker, id) => (
                <Marker
                  key={id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => {
                    setSelected(marker);
                  }}
                  icon={{
                    url: 'https://i.imgur.com/h7k1p1I.png',
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(20, 20),
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              ))}
              {selected ? (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => {
                    setSelected(null);
                  }}
                >
                  <div>
                    <h2>
                      <LandingInfo selected={selected} />
                    </h2>
                    <p>
                      <LandingVenue selected={selected} />
                    </p>
                  </div>
                </InfoWindow>
              ) : null}
            </GoogleMap>
          </div>
        </Col>
      </Row>
      <Divider></Divider>
      <Row>
        <Messages user={user} showID={showID} />
      </Row>
    </Container>
  );
};

export default ShowMessageBoard;
