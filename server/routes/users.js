const express = require('express');
const router = express.Router();
const { getUserByUUID } = require('../../db/queries/users');
const { validateUser } = require('../helpers/validation');
const { addFavourite, getAllFavourites, getFavouritesByUserId } = require('../../db/queries/favourites');

router.get('/favourites', (req, res) => {
  let templateVars = { apiKey: process.env.API_KEY };
  const uuid = req.cookies['user']

  getAllFavourites()
    .then((favourites) => {
      templateVars.maps = favourites;
      return getUserByUUID(uuid);
    })
    .then((user) => {
      templateVars.user = user;
      return res.render('favourites', templateVars);
    })
    .catch((err) => console.log(err));
})


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
      return getFavouritesByUserId(user.id);
    })
    .then((favourites) => {
      templateVars.maps = favourites;
      return res.render('favourites', templateVars);
    })
    .catch((err) => console.log(err));
});


router.post('/:user_id/favourites', (req, res) => {
  const userUUID = req.cookies['user'];
  const userId = req.params.user_id;
  const mapId = req.body.map_id;

  validateUser(userUUID, userId)
    .then((validation) => {
      if (!validation) {
        return res.redirect('/');
      }
      return addFavourite(userId, mapId);
    })
    .then(() => {
      return res.redirect(`/${userId}/favourites`);
    })
    .catch((err) => console.log(err));
});

module.exports = router
