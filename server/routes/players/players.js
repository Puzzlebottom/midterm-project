const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../../../db/connection');

router.get('/', (req, res) => {
  res.render('player');
});

router.post('/', (req, res) => {
  console.log(req.body);

  const { game_id, user_id, screen_name } = req.body;
  const queryString = `INSERT INTO players (game_id, user_id, screen_name, cookie_uuid)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

  const cookie_uuid = uuidv4();

  return db.query(queryString, [game_id, user_id, screen_name, cookie_uuid])
    .then((result) => {
      console.log(result.rows);
    }).catch((err) => console.log(err))

});

module.exports = router;

// POST /players —> add player to db
// POST /players/:player_id/hiding_spot —>  validate player cookie, then create new hiding spot for player
// POST /players/:player_id/guess —> validate player cookie, then create new guess for player
