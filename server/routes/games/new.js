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
  const { center, zoom, bounds } = req.body
  const boundsParsed = JSON.parse(bounds);
  const centerParsed = JSON.parse(center);
  const zoomNumber = Number(zoom);

  const userCookie = req.cookies['user'];

  if (!userCookie) {
    return res.redirect('../login');
  }

  const queryString = `
  INSERT INTO maps (center, bounds, zoom) VALUES ($1, $2, $3) RETURNING *;`;
  const queryValues = [centerParsed, boundsParsed, zoomNumber];
  db.query(queryString, queryValues).then(
    function (result) {
      console.log('SUPER RESULTS OF DESTINY! ==> ', result.rows);
    }
  ).catch((err) => {
    console.log('ERROR', err)
  })


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
