/**
 * do a get request message route on an interval to have a live feed
 * post any new data available to the feed
 * send the data down to message to me formatted or formate within
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

export default function Message({ body }) {
  const [name, setName] = useState('');
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
    const result = await axios.get('/api/messages/user', { params: { showId: obj.userId } });
    const username = result.data.userName;
    console.log("user", username);
    setName(username);
  };
  useEffect(() => {
    getUserName(body);
  }, []);
  return (
    <div>
      <h4 key={10}>{name}</h4>
      <p key={11}>{body.text}</p>
      <p key={12}>{moment(body.createdAt).fromNow()}</p>
    </div>
  );
}
