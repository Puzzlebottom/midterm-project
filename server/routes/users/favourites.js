const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');

router.get('/favourites', (req, res) => {
  //get all favourites
  const queryString = `SELECT * FROM maps
  JOIN favourites ON favourites.map_id = maps.id;`;
  db.query(queryString).then((results) => {
    const templateVars = {
      maps: results.rows,
      apiKey: process.env.API_KEY
    };
    console.log('RESULTS ==> ', results.rows);
    return res.render('favourites', templateVars);
  });
});

router.get(':user_id/favourites', (req, res) => {

  //check userCookie, if no => redirect /login;

  const queryString = `
    SELECT map_id FROM favourites
    JOIN maps ON map_id = maps.id
    JOIN users ON user_id = users.id
    WHERE users.id = $1;
    `;
  const queryValues = [req.params.user_id];
  db.query(queryString, queryValues).then((result) => {
    const templateVars = {
      maps: result.rows
    };
    res.render('favourites', templateVars);
  });
});

router.post(':user_id/favourites', (req, res) => {
  const userId = req.params.user_id;
  // check credentials
  const queryString = `
      INSERT INTO favourites (user_id, map_id)
      VALUES ($1, $2)
      `;
  const queryValues = [userId, req.body.map_id];
  return db.query(queryString, queryValues).then((result) => {
    res.redirect(':user_id/favourites');
  });
});
// check db for duplicate maps (on center, zoom & bounds)
// insert into favourites user_id, map_id (if new, otherwise, id of matched map)






module.exports = router;
