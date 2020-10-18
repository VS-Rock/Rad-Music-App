/**
 * do a get request message route on an interval to have a live feed
 * post any new data available to the feed
 * send the data down to message to me formatted or formate within
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import {
  Media, Carousel, Button, Modal,
} from 'react-bootstrap';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Message({ body }) {
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [index, setIndex] = useState(0);
  // const [count, setCount] = useState(0);
  const [lgShow, setLgShow] = useState(false);
  const [avatar, setAvatar] = useState(false);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  /** newBody
   * Index cheatsheet
      0: "id": 2,
      1: "text": "Tell me about it!",
      2: pictures": "TBD",
      3: "userId": 2,
      4: "showId": 1,
      5: "createdAt": "2020-10-14T20:56:08.000Z",
      6: "updatedAt": "2020-10-14T20:56:08.000Z"
   */
  const getUserName = async (obj) => {
    const result = await axios.get('/api/messages/user', { params: { userId: obj.userId } });
    const username = result.data.userName;
    // const pic = result.data.profilePic || `https://picsum.photos/200/300?random=${count}`;
    const pic = result.data.profilePic;
    result.data.profilePic ? setAvatar(false) : setAvatar(true);
    setName(username);
    setProfilePic(pic);
    // setCount(count++);
  };
  useEffect(() => {
    getUserName(body);
    body.pictures ? console.log('split', body.pictures.split(',')) : console.log('no pictures');
  }, []);
  return (
    <Media>
      { avatar
        ? <Avatar icon={<UserOutlined />} />
        : (
          <img
              width={64}
              height={64}
              className="mr-3"
              src={profilePic}
              alt="Generic placeholder"
          />
        ) }
      <Media.Body>
        <h4 key={10}>{name}</h4>
        <p key={11}>{body.text}</p>
        <p key={12}>{moment(body.createdAt).fromNow()}</p>
        {body.pictures && body.pictures.split(',').map((photo, index) => (
          <img
            styles={{ maxWidth: '20%', height: 'auto' }}
            className="d-block w-100"
            src={photo}
            alt="First slide"
            key={index}
          />
        ))}
      </Media.Body>
      {body.pictures && (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setLgShow(true)}
      >
        Enlarge Photos
      </Button>
      )}
      <Modal
        // size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {`${name}'s pictures`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
          >
            {body.pictures && body.pictures.split(',').map((photo, index) => (
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={photo}
                  alt="First slide"
                  key={index}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </Media>
  );
}
