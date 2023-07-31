const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.render('register', { apiKey: process.env.API_KEY });
});

router.post('/', (req, res) => {
  console.log('FORM DATA ===> ', req.body);
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
      console.log(result.rows);

      return res.redirect('/games/new');
    })
    .catch((error) => {
      return console.log('ERROR! ==>', error);
    });
}
);


module.exports = router;
