const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { checkUserCookie } = require('../../cookies/cookie');
const db = require('../../../db/connection');

router.get('/', (req, res) => {
  const hasUserCookie = checkUserCookie(req);

  if (hasUserCookie) {
    return res.redirect('/');
  }

  return res.render('login', { user: null });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  const queryString = `SELECT password FROM users WHERE name = $1;`;

  return db.query(queryString, [username])
    .then((result) => {
      return bcrypt.compareSync(password, result.rows[0].password);
    })
    .then((verified) => {
      if (verified) {
        res.cookie('user', true, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.redirect('/');
      } else {
        console.log('INVALID CREDENTIALS!');
        res.render('login', { error: 'Invalid username or password', user: null });
      }
    }).catch((err) => console.log(err));

});

module.exports = router;
