const express = require('express');
const router = express.Router();
const { addPlayer } = require('../../db/queries/players');
const { getPlayerCookie, givePlayerCookie } = require('../helpers/authorizePlayer');

router.post('/', async (req, res) => {
  const { game_id, user_id, screen_name } = req.body;
  const cookie_uuid = getPlayerCookie();

  addPlayer({ game_id, user_id, screen_name, cookie_uuid })
    .then((player) => {
      return givePlayerCookie(res, player.cookie_uuid); //setting cookie happens on
    });
});

module.exports = router;
