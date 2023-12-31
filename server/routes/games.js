const express = require('express');
const router = express.Router();
const { getUserByUUID } = require('../../db/queries/users');
const { addMap } = require('../../db/queries/maps');
const { getPlayerByUUID } = require('../../db/queries/players');
const { givePlayerCookie } = require('../helpers/authorizePlayer');
const { generateRandomString } = require('../helpers/gameHelpers');
const { addGame, getAllActiveGames, getGameById } = require('../../db/queries/games');
const { getFavouritesByUserId } = require('../../db/queries/favourites');


//get all available games
router.get('/', (req, res) => {

  const uuid = req.cookies['user'];
  let templateVars = { apiKey: process.env.API_KEY, user: null };
  getUserByUUID(uuid)
    .then((user) => {
      templateVars.user = user;

      if (!user) return null;

      return getFavouritesByUserId(user.id);
    })
    .then((favourites) => {
      const favouriteMapIds = [];
      for (const favourite of favourites) {
        favouriteMapIds.push(favourite.id);
      }
      templateVars.favouriteMapIds = favouriteMapIds;

      return getAllActiveGames();
    })
    .then((games) => {
      templateVars.games = games;

      return res.render('join-game', templateVars);
    })
    .catch((err) => console.log(err));
});


//go to game creation page
router.get('/new', (req, res) => {

  const mapOptions = {
    center: { lat: 48.765812262773615, lng: 11.358355018307819 },
    zoom: 2,
    restriction: { latLngBounds: { north: 85, south: -85, east: -168, west: -167.999999 }, strictBounds: true },
  };

  let templateVars = { apiKey: process.env.API_KEY, map: mapOptions };

  const uuid = req.cookies['user'];

  getUserByUUID(uuid)
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }
      templateVars.user = user;

      return res.render('new-game', templateVars);
    })
    .catch((err) => console.log(err));
});


//create new game
router.post('/new', (req, res) => {
  const { center, zoom, restriction } = req.body;
  const mapData = { center, zoom, restriction };
  const uuid = req.cookies['user'];
  let user;

  getUserByUUID(uuid)
    .then((validUser) => {
      if (!validUser) {
        return res.redirect('/login');
      }
      user = validUser;
      return addMap(mapData);
    })
    .then((map) => {
      const gameData = { mapId: map.id, ownerId: user.id, linkURL: generateRandomString(6) };
      return addGame(gameData);
    })
    .then((game) => {
      return res.redirect(`/games/${game.id}`);
    })
    .catch((err) => console.log(err));
});

router.get('/:game_id', (req, res) => {

  const userCookie = req.cookies['user'];
  const playerCookie = req.cookies['player'];
  const gameId = Number(req.params.game_id);
  let templateVars = { apiKey: process.env.API_KEY, player: null };

  getUserByUUID(userCookie)
    .then((user) => {
      templateVars.user = user;

      return getGameById(gameId);
    })
    .then((gameData) => {
      if (!gameData) {
        return res.send('No game exists with that ID');
      }
      const { map_id, center, zoom, restriction, id, owner_id, owner_name, started_at, ended_at, link_url, } = gameData;
      const map = { id: map_id, center, zoom, restriction };
      const game = { id, started_at, ended_at, link_url };
      const host = { id: owner_id, name: owner_name };

      templateVars.map = map;
      templateVars.game = game;
      templateVars.host = host;

      return getPlayerByUUID(playerCookie);
    })
    .then((player) => {

      if (!player) {
        return res.render('game', templateVars);
      }

      if (player.game_id !== gameId) {
        return res
          .clearCookie('player')
          .render('game', templateVars);
      }

      templateVars.player = player;
      return res.render('game', templateVars);
    })
    .catch((err) => console.log(err));


});

router.post('/:game_id/begin');

module.exports = router;


