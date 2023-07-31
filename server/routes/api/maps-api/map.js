/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const templateVars = {
    apiKey: process.env.API_KEY,
    lat: 50,
    lng: 10,
    zoom: 8
  }
  res.render('map', templateVars);
});

module.exports = router;
