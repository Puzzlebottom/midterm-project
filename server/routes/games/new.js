const express = require('express');
const router = express.Router();
const { checkUserCookie, getUserIdByCookie } = require('../../cookies/cookie');


router.get('/', (req, res) => {
  const hasUserCookie = checkUserCookie(req);
  if (!hasUserCookie) {
    return res.redirect('../login');
  }
  const userCookie = req.cookies.user;
  getUserIdByCookie(userCookie)
    .then((userId) => {
      const templateVars = { userId };
      return res.render('new-game', templateVars);
    })
    .catch((err) => console.log(err));
});


router.post('/', (req, res) => {
  const hasUserCookie = checkUserCookie(req);
  if (!hasUserCookie) {
    return res.redirect('../login');
  }

  const userCookie = req.cookies.user;

  const mapId = 1; //get map id from form data
  const linkURL = generateRandomString(6);

  const queryString = `
    INSERT INTO games (map_id, owner_id, link_url)
    VALUES ($1, (SELECT id FROM users WHERE cookie_uuid = $2), $3)
    RETURNING *;
  `;
  const queryValues = [mapId, userCookie, linkURL];

  db.query(queryString, queryValues)
    .then((result) => {
      const templateVars = result;
      return res.render('game', templateVars);
    })
    .catch((err) => console.log(err));
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
