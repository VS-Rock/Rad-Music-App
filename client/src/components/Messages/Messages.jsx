/**
 * do a get request message route on an interval to have a live feed
 * post any new data available to the feed
 * send the data down to message to me formatted or formate within
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Message from './Message';

export default function Messages({ user }) {
  const [showID, setShowID] = useState(2);
  const [userID, userShowID] = useState(0);
  const [messages, setMessage] = useState([]);

  useEffect(() => {
    axios.get('/api/messages', { params: { showId: showID } })
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div>
      <h2>{user}</h2>
      {messages.map((message, key) => (
        <Message body={message} user={user} key={key} />
      ))}
    </div>
  );
}

Messages.propTypes = {
  // user: PropTypes.string.isRequired
};
