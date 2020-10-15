const { Router } = require('express');
const {
  Show, User,
} = require('../db/index');

const Message = Router();

module.exports = {
  Message,
};