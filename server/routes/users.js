const express = require('express');
const router = express.Router();
const { getUserByUUID } = require('../../db/queries/users');
const { validateUser } = require('../helpers/userValidation');
const { getGameOwnerByMapId } = require('../../db/queries/games');
const { addFavourite, getAllFavourites, getFavouritesByUserId, removeFavourite } = require('../../db/queries/favourites');

router.get('/favourites', (req, res) => {
  let templateVars = { apiKey: process.env.API_KEY };
  const uuid = req.cookies['user'];

  getAllFavourites()
    .then((favourites) => {
      templateVars.maps = favourites;
      return getUserByUUID(uuid);
    })
    .then((user) => {
      templateVars.user = user;

      if (!user) return [];

      return getFavouritesByUserId(user.id);
    })
    .then((favourites) => {
      const favouriteMapIds = [];
      for (const favourite of favourites) {
        favouriteMapIds.push(favourite.id);
      }
      templateVars.favouriteMapIds = favouriteMapIds;

      return res.render('favourites', templateVars);
    })
    .catch((err) => console.log(err));
});


router.get('/:user_id/favourites', (req, res) => {
  const userUUID = req.cookies['user'];
  const userId = req.params.user_id;
  let templateVars = { apiKey: process.env.API_KEY };

  validateUser(userUUID, userId)
    .then((validation) => {
      if (!validation) {
        return res.redirect('/');
      }
      return getUserByUUID(userUUID);
    })
    .then((user) => {
      templateVars.user = user;

      if (!user) return [];

      return getFavouritesByUserId(user.id);
    })
    .then((favourites) => {
      templateVars.maps = favourites;
      const favouriteMapIds = [];
      for (const favourite of favourites) {
        favouriteMapIds.push(favourite.id);
      }
      templateVars.favouriteMapIds = favouriteMapIds;

      return res.render('favourites', templateVars);
    })
    .catch((err) => console.log(err));
});


router.post('/:user_id/favourites', (req, res) => {
  const userUUID = req.cookies['user'];
  const userId = Number(req.params.user_id);
  const mapId = Number(req.body.map_id);

  validateUser(userUUID, userId)
    .then((validation) => {
      if (!validation) {
        return null;
      }

      return getFavouritesByUserId(userId);
    })
    .then((favourites) => {
      const ids = [];
      for (const favourite of favourites) {
        ids.push(favourite.id);
      }
      if (ids.includes(mapId)) {
        return removeFavourite(userId, mapId);
      }
      return addFavourite(userId, mapId);
    })
    .then((favourite) => {
      if (!favourite) {
        return res.redirect('/');
      }
      return res.redirect(`/users/${userId}/favourites`);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
