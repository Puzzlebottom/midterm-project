const { v4: uuidv4 } = require('uuid');
const { getPlayerByUUID } = require('../../db/queries/players')

const getPlayerCookie = () => uuidv4()

const validatePlayer = async (uuid) => {
  const player = await getPlayerByUUID(uuid)
  return player ? true : false;
}

const givePlayerCookie = (response, uuid) => {
  const cookieParams = { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }; //24 hours
  return response.cookie('player', uuid, cookieParams);
};

module.exports = { getPlayerCookie, givePlayerCookie, validatePlayer }

