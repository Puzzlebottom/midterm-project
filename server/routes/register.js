const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('register', { apiKey: process.env.API_KEY });
});

router.post('/', (req, res) => {
  console.log('REGISTERED!')
  res.redirect('/new-game');
})


module.exports = router;