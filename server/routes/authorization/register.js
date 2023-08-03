const express = require('express');
const router = express.Router();
const { registerUser } = require('../../helpers/userValidation');

router.get('/', (req, res) => {
  const cookie = req.cookies;

  if (cookie['user']) {
    return res.redirect('/');
  }

  return res.render('register', { user: null });
});


router.post('/', (req, res) => {
  const { username, password } = req.body;

  return registerUser(res, { username, password })
    .then((response) => {
      return response.redirect('/');
    })
    .catch((error) => {
      return console.log(error);
    });
}
);


module.exports = router;
