const express = require('express');
const router = express.Router();
const { addHidingSpot, getHidingSpotById, getHidingSpotForPlayer, getAllHidingSpotsForGame } = require('../../db/queries/hidingSpots');

router.get('/', (req, res) => {
  //get all hiding spots
})

router.post('/', (req, res) => {
  const hidingSpotData = req.body.payload;
  return addHidingSpot(hidingSpotData)
    .then((result) => {
      console.log('result ==> ', result.rows[0]);
      return res.json(result.rows[0]);
    })


})

router.get('/:id', (req, res) => {
  //get hiding spot by id
})

module.exports = router;
