const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.clearCookie('user');
  res.redirect('/');
});
module.exports = router;
