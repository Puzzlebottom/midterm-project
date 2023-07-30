const { v4: uuidv4 } = require('uuid');
const db = require('../../db/connection')

const checkCookie = function (request) {
  const cookie = request.cookies.playerId;
  return cookie ? true : false;
};

const giveCookie = function (response) {
  return response.cookie('playerId', uuidv4(), { maxAge: 24 * 60 * 60 * 1000 , httpOnly: true }); // 24 hours
};

const getPlayerName = function (cookie) {
  const queryString = `SELECT name FROM players WHERE cookie_uuid = $1`;
  const values = [cookie.playerId];
  db.query(queryString, values).then(
  function(result) {
    console.log(result);
  }
)
};

module.exports = {checkCookie, giveCookie, getPlayerName};