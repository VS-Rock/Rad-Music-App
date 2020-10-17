const { Router } = require('express');
const {
  Show, User, Message,
} = require('../db/index');
require('dotenv').config();

const Messages = Router();
const axios = require('axios');
const { Op } = require('sequelize');
/**
 * when the component is rendering message will show messages for a selected show
 * -- message should pass down the selected show and userid
 * -- do a db seach for the messages associate with the show
 * -- make sure that the shows are in chronological order from most recent to lease recent
 * when the user post, the message should be added
 * -- do a post to the messages with the user id and showid
 * -- both should come from client
 * -- add the user's message to the table
 * -- return status that it worked
 * -- client will handle the rest
 */
Messages.get('/', (req, res) => {
  const { showId } = req.query;
  // Find all Messages
  Message.findAll({
    where: {
      showId: {
        [Op.eq]: showId,
      },
    },
    order: [['updatedAt', 'DESC']],
  })
    .then((result) => {
      if (result.length > 0) {
        res.json(result);
        res.end();
      } else {
        res.json([{ text: 'No Messages, send to be the first' }]);
        res.end();
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

Messages.get('/user', (req, res) => {
  const { userId } = req.query;
  User.findOne({
    where: {
      id: {
        [Op.eq]: 1,
      },
    },
  })
    .then((result) => {
      res.json(result);
      res.end();
    })
    .catch((err) => {
      console.error(err);
    });
});

Messages.post('/post', (req, res) => {
  const { text, userId, pictures, showId } = req.body;
  console.log(text, userId, pictures, showId);
  res.sendStatus(200);
  // Message.create({ firstName: "Jane", lastName: "Doe" });
});

Messages.get('/name/:user', (req, res) => {
  const { user } = req.params;
  console.log(req.params);
  User.findOne({
    where: {
      userName: user,
    },
  })
    .then((result) => {
      res.json(result.id);
      res.end();
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = {
  Messages,
};
