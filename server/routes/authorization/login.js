const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { loginUser } = require('../../helpers/userValidation');
const db = require('../../../db/connection');

router.get('/', (req, res) => {
  const cookie = req.cookies;

  if (cookie['user']) {
    return res.redirect('/');
  }

  return res.render('login', { user: null });
});

router.post('/', (req, res) => {
  return loginUser(res, req)
    .then((response) => {
      response.redirect('/');
    });
});

module.exports = router;
