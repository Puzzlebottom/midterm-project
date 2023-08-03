const express = require('express');
const router = express.Router();
const { addHidingSpot, getHidingSpotById, getHidingSpotForPlayer, getAllHidingSpotsForGame } = require('../../db/queries/hidingSpots');

router.get('/', (req, res) => {
  //get all hiding spots
})

router.post('/', (req, res) => {

  const hidingSpotData = req.body;
  const { lat, lng } = hidingSpotData.location;
  const picture = getStaticImageURL(lat, lng)
  const { location, playerId, gameId, clue } = hidingSpotData;

  return addHidingSpot({ location, playerId, gameId, picture, clue })
    .then((result) => {
      return res.json(result);
    })
})

router.get('/:id', (req, res) => {
  //get hiding spot by id
})

const getStaticImageURL = (lat, lng) => {
  return `https://maps.googleapis.com/maps/api/streetview?size=300x300&location=${lat},${lng}&fov=80&heading=70&pitch=0&key=${process.env.API_KEY}`
};

module.exports = router;
