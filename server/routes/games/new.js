const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');
const { getUserByCookie } = require('../../helpers/authorizeUser');

router.get('/', (req, res) => {
  const userCookie = req.cookies['user'];
  if (!userCookie) {
    return res.redirect('../login');
  }

  const defaultMapData = {
    center: { lat: 48.765812262773615, lng: 11.358355018307819 },
    zoom: 1,
    bounds: { latLngBounds: { north: 85, south: -85, east: -168, west: -167.999999 }, strictBounds: true },
  };

  getUserByCookie(userCookie)
    .then((user) => {
      const templateVars = {
        user,
        defaultMapData,
        apiKey: process.env.API_KEY
      };

      return res.render('new-game', templateVars);
    })
    .catch((err) => console.log(err));
});


router.post('/', (req, res) => {
  const { center, zoom, bounds } = req.body;
  console.log(req.body);

  const boundsParsed = JSON.parse(bounds);
  const centerParsed = JSON.parse(center);
  const zoomNumber = Number(zoom);

  const userCookie = req.cookies['user'];

  if (!userCookie) {
    return res.redirect('../login');
  }

  let mapId;


  const queryString1 = `
  INSERT INTO maps (center, bounds, zoom) VALUES ($1, $2, $3) RETURNING *;`;
  const queryValues1 = [centerParsed, boundsParsed, zoomNumber];
  db.query(queryString1, queryValues1)
    .then(
      function(savedMap) {
        mapId = savedMap.rows[0].id;
        const user = getUserByCookie(req.cookies.user);
        console.log(user);
        return user;
      })
    .then((user) => {
      console.log(user);
      const userId = user.id;
      const linkURL = generateRandomString(6);

      const queryString2 = `
        INSERT INTO games (map_id, owner_id, link_url)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const queryValues2 = [mapId, userId, linkURL];

      db.query(queryString2, queryValues2)
        .then((result) => {
          console.log('SAVED MAP ==> ', result.rows);
          const templateVars = result.rows[0];
          return res.render('game', templateVars);
        });

    })

    .catch((err) => {
      console.log('ERROR', err);
    });

});



const numerics = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const lowerCase = 'abcdefghijklmnopqrstuvwxyz'.split('');

const ALPHANUMERIC_CHARS = [...numerics, ...upperCase, ...lowerCase];

const generateRandomString = (stringLength) => {
  const totalNumberOfChars = ALPHANUMERIC_CHARS.length;
  let randomString = '';
  for (let i = 1; i <= stringLength; i++) {
    const randomIndex = Math.floor(Math.random() * totalNumberOfChars);
    randomString += ALPHANUMERIC_CHARS[randomIndex];
  }
  return randomString;
};

module.exports = router;
