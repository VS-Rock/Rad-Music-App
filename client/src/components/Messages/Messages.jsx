/**
 * do a get request message route on an interval to have a live feed
 * post any new data available to the feed
 * send the data down to message to me formatted or formate within
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { Divider } from 'antd';
import Message from './Message';
import AddMessage from './AddMessage';

export default function Messages({ user, showID }) {
  const [messages, setMessage] = useState([]);
  const [hideMessages, setHideMessages] = useState(true);

  const getMessage = () => {
    axios.get('/api/messages', { params: { showId: showID } })
      .then((res) => {
        if (res.data[0].text === 'No Messages') {
          setHideMessages(true);
        } else {
          setHideMessages(false);
          setMessage(res.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getMessage();
  });
  return (
    <Col span={24}>
      <h2>{user}</h2>
      <AddMessage user={user} showId={showID} getMessage={getMessage} />
      <div>
        {hideMessages ? <Divider plain>No Messages</Divider>
          : messages.map((message, key) => (
            <Message body={message} user={user} key={key} showId={showID} />
          ))}
      </div>
    </Col>
  );
}

Messages.propTypes = {
  // user: PropTypes.string.isRequired
};
