const express = require('express');
const router = express.Router();
const { getUserByUUID } = require('../../db/queries/users');
const { addMap } = require('../../db/queries/maps');
const { addGame } = require('../../db/queries/games');
const { generateRandomString } = require('../helpers/gameHelpers')


//get all available games
router.get('/', (req, res) => {

})


//go to game creation page
router.get('/new', (req, res) => {

  const mapOptions = {
    center: { lat: 48.765812262773615, lng: 11.358355018307819 },
    zoom: 2,
    restriction: { latLngBounds: { north: 85, south: -85, east: -168, west: -167.999999 }, strictBounds: true },
  };

  let templateVars =  { apiKey: process.env.API_KEY, mapOptions };

  const uuid = req.cookies['user']

  getUserByUUID(uuid)
    .then((user) => {
      if (!user) {
        return res.redirect('/login')
      }
      templateVars.user = user

      return res.render('new-game', templateVars)
    })
    .catch((err) => console.log(err))
});


//create new game
router.post('/new', (req, res) => {

  let templateVars =  { apiKey: process.env.API_KEY };

  const { center, zoom, restriction } = req.body;
  const mapData = {center, zoom, restriction}
  const uuid = req.cookies['user'];

  getUserByUUID(uuid)
    .then((user) => {
      if (!user) {
        return res.redirect('/login')
      }

      templateVars.user = user;

      return addMap(mapData)
    })
    .then((map) => {
      templateVars.map = map

      const mapId = map.id;
      const ownerId = templateVars.user.id
      const linkURL = generateRandomString();

      const gameData = {mapId, ownerId, linkURL}

      return addGame(gameData)
    })
    .then((game) => {
      return res.render('game', templateVars)
    })
    .catch((err) => console.log(err))
})

router.get('/:game_id')

router.post('/:game_id/begin')


