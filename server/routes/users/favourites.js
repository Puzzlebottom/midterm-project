const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');
const {getUserByCookie} = require('../../helpers/authorizeUser')

router.get('/favourites', (req, res) => {
  //get all favourites

  let userCookie = req.cookies['user'];
  const templateVars = {
    maps: null,
    user: null,
    apiKey: process.env.API_KEY
  };

  if (userCookie) {
    getUserByCookie(userCookie)
      .then((user) => {
        templateVars.user = user;

        const queryString = `SELECT * FROM maps
        JOIN favourites ON favourites.map_id = maps.id;`;

        return db.query(queryString).then((results) => {
          templateVars.maps = results.rows;

          return res.render('favourites', templateVars);
        })
      })
  } else {
    const queryString = `SELECT * FROM maps
        JOIN favourites ON favourites.map_id = maps.id;`;

        db.query(queryString).then((results) => {
          templateVars.maps = results.rows;

          return res.render('favourites', templateVars);
    })
  }
})


router.get('/:user_id/favourites', (req, res) => {
  console.log("USERID = ", req.params.user_id)

  let userCookie = req.cookies['user'];
  const templateVars = {
    maps: null,
    user: null,
    apiKey: process.env.API_KEY
  };

  if (userCookie) {
    return getUserByCookie(userCookie)
      .then((user) => {
        templateVars.user = user;

        const queryString = `
        SELECT map_id FROM favourites
        JOIN maps ON map_id = maps.id
        JOIN users ON user_id = users.id
        WHERE users.id = $1;
        `;
        const queryValues = [req.params.user_id];

        return db.query(queryString, queryValues)
          .then((results) => {
          templateVars.maps = results.rows;

          return res.render('favourites', templateVars);
        })
      })
  }
  return res.redirect('/');
});


router.post('/:user_id/favourites', (req, res) => {
  const userId = req.params.user_id;
  // check credentials
  const queryString = `
      INSERT INTO favourites (user_id, map_id)
      VALUES ($1, $2)
      `;
  const queryValues = [userId, req.body.map_id];
  return db.query(queryString, queryValues).then((result) => {
    res.redirect(':user_id/favourites');
  });
});
// check db for duplicate maps (on center, zoom & bounds)
// insert into favourites user_id, map_id (if new, otherwise, id of matched map)






module.exports = router;
