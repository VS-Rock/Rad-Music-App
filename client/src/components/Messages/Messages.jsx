/**
 * do a get request message route on an interval to have a live feed
 * post any new data available to the feed
 * send the data down to message to me formatted or formate within
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import Message from './Message';
import AddMessage from './AddMessage';

export default function Messages({ user }) {
  const [showID, setShowID] = useState(2);
  const [messages, setMessage] = useState([]);
  const [show, setShow] = useState(false);

  const getMessage = () => {
    axios.get('/api/messages', { params: { showId: showID } })
      .then((res) => {
        console.log("get messages == body", res.data);
        setMessage(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getMessage();
  }, []);
  return (
    <div>
      <h2>{user}</h2>
      <AddMessage user={user} showId={showID} getMessage={getMessage} />
      {messages.map((message, key) => (
        <Message body={message} user={user} key={key} />
      ))}
    </div>
  );
}

Messages.propTypes = {
  // user: PropTypes.string.isRequired
};
