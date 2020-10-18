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
import { Container, Row, Col } from 'react-bootstrap';
import mapStyles from '../Add/styles';
import Messages from '../Messages/Messages';
import { LandingInfo, LandingVenue } from '../Landing/LandingInfo';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '80vh',
};
const center = {
  lat: 30,
  lng: -90,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const ShowMessageBoard = ({ user, genre }) => {
  /** NEED: showId to pass to messages component */
  const [showID, setShowID] = useState(null); // show id goes here
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

  const getGenres = () => {
    const params = { genre };
    Axios.get('/api/shows/genre', { params })
      .then(({ data }) => {
        data.forEach((entry) => {
          const {
            lat,
            lng,
            bandName,
            venue,
            details,
            date,
          } = entry;
          test.push({
            lat: Number(lat), lng: Number(lng), bandName, venue, genre, details, date,
          });
        });
        setFavoriteGenre(test);
      });
  };

  if (loadError) return 'ERROR LOADING MAPS';
  if (!isLoaded) return 'LOADING MAPS';

  return (
    <Container>
      <div style={{
        // border: 'solid green 1px',
        // padding: '10px',
      }}
      >
        <div style={{
          // border: 'solid green 1px',
          float: 'left',
          padding: '10px',
        }}
        >
          <p>Shows</p>

        </div>

      </div>
      <Row>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
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
                  {/* how to get these thing by themselves */}
                  <LandingInfo selected={selected} />
                </h2>
                <p>
                  <LandingVenue selected={selected} />
                </p>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </Row>
      <Row>
        <Messages user={user} showID={showID} />
      </Row>
    </Container>
  );
};

export default ShowMessageBoard;
