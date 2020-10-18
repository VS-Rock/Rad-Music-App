require('dotenv').config();
const { Router } = require('express');
const twilio = require('twilio');

const Twilio = Router();

// twilio requirements --- after creating twilio account on twilio site
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const autheToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, autheToken);

Twilio.post('/text', (req, res) => {
  // Variables passed via query string
  res.send('welcome to twilio');
  const {
    recipient, date, name, venue,
  } = req.body;

  // send the text
  client.messages.create({
    body: `Hello this is your reminder for ${name} on ${date} at ${venue}`,
    from: '+14809330219',
    to: `+1${recipient}`,
  })
    .then((message) => console.log(message.body))
    .catch((err) => console.log(err));
});

module.exports = {
  Twilio,
};
