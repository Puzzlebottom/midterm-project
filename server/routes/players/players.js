const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const db = require('../../../db/connection');

router.get('/', (req, res) => {
  res.render('player');
});

router.post('/players', (req, res) => {
  console.log('New player');
  const { username } = req.body;
  const queryString = `INSERT INTO players (screen_name)
    VALUES ($1)
    RETURNING *`;

  db.query(queryString, [username])
    .then((result) => {
      console.log(result.rows);
      return res.redirect('/');
    }).catch((err) => console.log(err))

})



module.exports = router;

// POST /players —> add player to db
// POST /players/:player_id/hiding_spot —>  validate player cookie, then create new hiding spot for player
// POST /players/:player_id/guess —> validate player cookie, then create new guess for player
