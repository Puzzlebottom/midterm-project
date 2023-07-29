const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('join-game', { apiKey: process.env.API_KEY });
});

module.exports = router;
