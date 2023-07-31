const express = require('express');
const router = express.Router();
const { checkPlayerCookie, getPlayerNameByCookie } = require('../../cookies/cookie');

router.get('/', (req, res) => {
  return res.render('join-game');
});

module.exports = router;
