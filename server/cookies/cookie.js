const { v4: uuidv4 } = require('uuid');
const db = require('../../db/connection');

const cookieParams = { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }; //24 hours

const checkPlayerCookie = (request) => {
  const playerCookie = request.cookies.playerId;
  return playerCookie ? true : false;
};

const checkUserCookie = (request) => {
  const userCookie = request.cookies.authorizedUser;
  return userCookie ? true : false;
};

const givePlayerCookie = (response) => {
  return response.cookie('player', uuidv4(), cookieParams);
};

const giveUserCookie = (response) => {
  return response.cookie('user', uuidv4(), cookieParams);
};

const getPlayerName = function(cookie) {
  const queryString = `SELECT screen_name FROM players WHERE cookie_uuid = $1`;
  const values = [cookie.playerId];
  db.query(queryString, values).then(
    function(result) {
      console.log(result);
    }
  );
};

module.exports = { checkPlayerCookie, checkUserCookie, givePlayerCookie, giveUserCookie, getPlayerName };
