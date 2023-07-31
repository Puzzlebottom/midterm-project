const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const db = require('../../../db/connection');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  console.log('LOGGED IN!');
  const {username, password} = req.body;
  const queryString = `SELECT password FROM users WHERE name = $1;`

  return db.query(queryString, [username])
  .then((result) => { return argon2.verify(result.rows[0].password, password)})
  .then((verified) => {
    if (verified) {
      res.cookie('user', true, { maxAge: 24 * 60 * 60 * 1000 , httpOnly: true })
      console.log('VERIFIED!')
      res.redirect('/new-game');
    }
  }).catch((err) => console.log(err))

})

module.exports = router;
