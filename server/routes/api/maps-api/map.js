/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const db = require('../../../../db/connection');

const queryString = `
select * from maps
where id = 1`;
//TODO: change this to a query that gets the map id for the current game
const query = () => {
  return db.query(queryString);
};

query().then((result) => {
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
