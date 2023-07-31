const { v4: uuidv4 } = require('uuid');
const db = require('../../db/connection');

const cookieParams = { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }; //24 hours

const checkPlayerCookie = (request) => {
  const playerCookie = request.cookies.player;
  return playerCookie ? true : false;
};

const checkUserCookie = (request) => {
  const userCookie = request.cookies.user;
  return userCookie ? true : false;
};

const givePlayerCookie = (response) => {
  return response.cookie('player', uuidv4(), cookieParams);
};

const giveUserCookie = (response) => {
  return response.cookie('user', uuidv4(), cookieParams);
};

const getUserIdByCookie = (cookie) => {
  const queryString = `SELECT id FROM users WHERE cookie_uuid = $1;`;
  const values = [cookie.user];
  return db.query(queryString, values)
    .then((result) => {
      console.log("getUserIdByCookie: ", result.rows);
      return result.rows[0];
    });
};

const getPlayerNameByCookie = (cookie) => {
  const queryString = `SELECT screen_name FROM players WHERE cookie_uuid = $1;`;
  const values = [cookie.player];
  return db.query(queryString, values)
    .then((result) => {
      console.log("getPlayerNameByCookie: ", result.rows);
      return result.rows[0];
    });
};

module.exports = { checkPlayerCookie, checkUserCookie, givePlayerCookie, giveUserCookie, getPlayerNameByCookie, getUserIdByCookie };
