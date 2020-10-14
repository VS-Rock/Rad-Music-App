/* eslint-disable camelcase */
/* eslint-disable no-console */
require('dotenv').config();
const {
  Show,
  User,
  ShowsBands,
  Band,
  Message,
} = require('../db/index.js');

function primeDB() {
  Show.findOrCreate({
    where: {
      venue: 'Madison Square Garden',
      date:'10/20/20',
      lat:'40.7505',
      lng:'73.9934',
      details: 'Big show with lots of music',
    },
  })
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Show (Madison Square Garden) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Show.findOrCreate({
      where: {
        venue: 'House of Blues',
        date:'10/20/20',
        lat:'29.9534',
        lng:'90.0663',
        details: 'Jam Session',
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Show (House of Blues) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Show.findOrCreate({
      where: {
        venue: 'LakeFront',
        date:'10/30/20',
        lat:'30.0385',
        lng:'90.0264',
        details: 'Big ole show',
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Show (LakeFront) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Show.findOrCreate({
      where: {
        venue: 'LakeFront',
        date:'11/1/20',
        lat:'30.0385',
        lng:'90.0264',
        details: 'MusicFest',
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Show (LakeFront2) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Band.findOrCreate({
      where: {
        bandName: 'Mozart 2.0',
        genreId: 2,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Band (Mozart2.0) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Band.findOrCreate({
      where: {
        bandName: 'Chance the Rapper',
        genreId: 5,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Band (Chance the Rapper) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => User.findOrCreate({
      where: {
        userName: 'Billy Madison',
        pictures: 'TBD',
        profilePic: 'TBD',
        googleId: 'TBD',
        genreId: 8,
        profilePrompt: false,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ User (Billy Madison) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => User.findOrCreate({
      where: {
        userName: 'Happy Gilmore',
        pictures: 'TBD',
        profilePic: 'TBD',
        googleId: 'TBD',
        genreId: 2,
        profilePrompt: false,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ User (Happy Gilmore) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => ShowsBands.findOrCreate({
      where: {
        bandId: 1,
        showId: 1,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ ShowBand Join (1-1) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => ShowsBands.findOrCreate({
      where: {
        bandId: 2,
        showId: 2,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ ShowBand Join (2-2) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => ShowsBands.findOrCreate({
      where: {
        bandId: 1,
        showId: 3,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ ShowBand Join (1-3) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Message.findOrCreate({
      where: {
        text: 'This is gonna be lit',
        pictures: 'TBD',
        userId: 1,
        showId: 1,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Message Join (1-1) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Message.findOrCreate({
      where: {
        text: 'Tell me about it!',
        pictures: 'TBD',
        userId: 2,
        showId: 1,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Message Join (2-1) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Message.findOrCreate({
      where: {
        text: 'Ima totally be there',
        pictures: 'TBD',
        userId: 1,
        showId: 2,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Message Join (1-2) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Message.findOrCreate({
      where: {
        text: 'ditto',
        pictures: 'TBD',
        userId: 2,
        showId: 2,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Message Join (2-2) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Message.findOrCreate({
      where: {
        text: 'I thought they were in Asia atm!',
        pictures: 'TBD',
        userId: 1,
        showId: 3,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Message Join (1-3) Created');
      }
      return console.error('❌save undefined');
    })
    .then(() => Message.findOrCreate({
      where: {
        text: 'nah dawg, they in town!',
        pictures: 'TBD',
        userId: 2,
        showId: 3,
      },
    }))
    .then((numberEffected) => {
      if (numberEffected) {
        return console.log('✅ Message Join (2-3) Created');
      }
      return console.error('❌save undefined');
    })
    .catch((err) => {
      console.error(`❌${err}`);
    });
}

primeDB();
