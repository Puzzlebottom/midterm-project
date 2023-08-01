const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');
const {checkUserCookie} = require('../../cookies/cookie')
const bcrypt = require('bcrypt');
const {registerUser} = require('../../helpers/authorizeUser')

router.get('/', (req, res) => {
  const hasUserCookie = checkUserCookie(req);

  if (hasUserCookie) {
    res.redirect('/')
  }

  res.render('register', {user: null});
});


router.post('/', (req, res) => {
  const { username, password } = req.body;

 registerUser(res, username, password)
    .then((result) => {
      return res.redirect('/');
    })
    .catch((error) => {
      return console.log(error);
    });
}
);


module.exports = router;
