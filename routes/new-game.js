const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('new-game', { apiKey: process.env.API_KEY });
});

module.exports = router;
