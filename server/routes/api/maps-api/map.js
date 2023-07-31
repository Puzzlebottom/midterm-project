/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const db = require('../../../../db/connection');

const queryString = `
select * from map_test
where id = 2`;
const query = () => {
  return db.query(queryString);
};

query().then((result) => {
  console.log(result.rows[0]);
  router.get('/', (req, res) => {
    const templateVars = {
      apiKey: process.env.API_KEY,
      lat: result.rows[0].lat,
      lng: result.rows[0].lng,
      zoom: 8
    }
    res.render('map', templateVars);
  });
});

module.exports = router;
