const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');
const {checkUserCookie} = require('../../cookies/cookie')
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  const hasUserCookie = checkUserCookie(req);

  if (hasUserCookie) {
    res.redirect('/')
  }

  res.render('register', {user: null});
});

router.post('/', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const queryString = `
        INSERT INTO users (name, password)
        VALUES ($1, $2)
        RETURNING *`;
      const values = [username, hashedPassword];

      return db.query(queryString, values);
    })
    .then((result) => {
      return res.redirect('/');
    })
    .catch((error) => {
      return console.log(error);
    });
}
);


module.exports = router;
