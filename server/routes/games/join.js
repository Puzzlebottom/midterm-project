const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../../../db/connection');
const { checkPlayerCookie, getPlayerNameByCookie, givePlayerCookie, checkUserCookie, getUserIdByCookie } = require('../../cookies/cookie');

router.get('/', (req, res) => {
  return res.render('join-game');
});

router.post('/', (req, res) => {

  const hasPlayerCookie = checkPlayerCookie();

  if (hasPlayerCookie) {
    getPlayerNameByCookie(req.cookies)
      .then((playerName) => {
        const templateVars = { playerName };
        return res.render('game', templateVars);
      })
      .catch((err) => console.log(err));
  }

  const gameId = req.body.game_id;
  const playerCookie = uuidv4();
  const hasUserCookie = checkUserCookie(req);

  if (hasUserCookie) {
    getUserIdByCookie(req.cookies)
      .then((userId) => {
        const queryString = `
        INSERT INTO players (game_id, user_id, screen_name, cookie_uuid)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`;
        const queryValues = [gameId, userId, 'FuzzyWuzzy', playerCookie];

        db.query(queryString, queryValues)
          .then((result) => {
            const templateVars = result;

            givePlayerCookie(res).render('game', templateVars);
          });
      })
      .catch((err) => console.log(err));
  };

  if (!hasUserCookie) {
    const queryString = `
    INSERT INTO players (game_id, screen_name, cookie_uuid)
    VALUES ($1, $2, $3)
    RETURNING *;`;
    const queryValues = [gameId, 'FuzzyWuzzy', playerCookie];

    db.query(queryString, queryValues)
      .then((result) => {
        const templateVars = result;
        return givePlayerCookie(res).render('game', templateVars);
      })
      .catch((err) => console.log(err));
  };
});

module.exports = router;
