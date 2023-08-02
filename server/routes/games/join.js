const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../../../db/connection');
const { checkPlayerCookie, getPlayerNameByCookie, givePlayerCookie, checkUserCookie, getUserIdByCookie } = require('../../cookies/cookie');
const { getUserByCookie } = require('../../helpers/authorizeUser');

router.get('/', (req, res) => {
  // get all games in db with started_at = NULL
  // get static image of each map
  // template vars: game data: owner name, player's names, map image
  getUserByCookie(req.cookies['user'])
    .then((user) => {
      const queryString = `
      SELECT users.name AS owner_name, games.*, maps.*
      FROM games
      JOIN users ON (users.id = games.owner_id)
      JOIN maps ON (maps.id = games.map_id)
      GROUP BY games.id, users.name, maps.id
      ORDER BY games.id;
      `
  //    { "lat": 40.66834046220102, "lng": 104.30954172268272 }, "zoom": 4,
      db.query(queryString)
        .then((results) => {
          console.log(results.rows)

          const templateVars = {
            user,
            apiKey: process.env.API_KEY,
            games: results.rows
          }
          return res.render('join-game', templateVars);
        })
        .catch((err) => console.log(err))
    })
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
