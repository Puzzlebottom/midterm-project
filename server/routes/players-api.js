const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../../db/connection');

router.get('/', (req, res) => {
  res.render('player');
});

router.post('/', (req, res) => {

  const { game_id, user_id, screen_name } = req.body;
  const queryString = `INSERT INTO players (game_id, user_id, screen_name, cookie_uuid)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

  const cookie_uuid = uuidv4();

  return db.query(queryString, [game_id, user_id, screen_name, cookie_uuid])
    .then((result) => {
    }).catch((err) => console.log(err))

});

module.exports = router;
