const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');
const { getUserByCookie } = require('../../helpers/authorizeUser')

router.get('/', (req, res) => {
  const userCookie = req.cookies['user'];
  if (!userCookie) {
    return res.redirect('../login');
  }

  getUserByCookie(userCookie)
    .then((user) => {
      const templateVars = { user, apiKey: process.env.API_KEY };
      return res.render('new-game', templateVars);
    })
    .catch((err) => console.log(err));
});


router.post('/', (req, res) => {
  const { lat, lng, zoom, bounds } = req.body
  console.log("LAT: ", lat)
  console.log("TYPE LAT: ", typeof lat)
  console.log("lng: ", lng)
  console.log("TYPE lng: ", typeof lng)
  console.log("ZOOM: ", zoom)
  console.log("TYPE ZOOM: ", typeof zoom)
  console.log("bounds: ", bounds)
  console.log("TYPE bounds: ", typeof bounds)

  const userCookie = req.cookies['user'];

  return res.render('/');

  // if (!userCookie) {
  //   return res.redirect('../login');
  // }

  // const mapId = 1; //get map id from form data
  // const linkURL = generateRandomString(6);

  // const queryString = `
  //   INSERT INTO games (map_id, owner_id, link_url)
  //   VALUES ($1, (SELECT id FROM users WHERE cookie_uuid = $2), $3)
  //   RETURNING *;
  // `;
  // const queryValues = [mapId, userCookie, linkURL];

  // db.query(queryString, queryValues)
  //   .then((result) => {
  //     const templateVars = result;
  //     return res.render('game', templateVars);
  //   })
  //   .catch((err) => console.log(err));
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
