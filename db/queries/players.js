const db = require('../connection');

const addPlayer = async (playerData) => {
  const { game_id, user_id, screen_name, cookie_uuid } = playerData;
  const query = `
  INSERT INTO players (game_id, user_id, screen_name, cookie_uuid)
  VALUES ($1, $2, $3, $4) RETURNING *;`;
  const values = [game_id, user_id, screen_name, cookie_uuid];

  const data = await db.query(query, values);
  if (data.rows.length === 0) {
    return null;
  }
  return data.rows[0];
};

const getPlayerByUUID = async (uuid) => {
  const query = 'SELECT * FROM players WHERE cookie_uuid = $1';
  const values = [uuid];

  const data = await db.query(query, values);
  if (data.rows.length === 0) {
    return null;
  }

  return data.rows[0];
};

const getPlayerById = (playerId) => {
  const query = `SELECT * FROM players WHERE id = $1;`;
  const values = [playerId];
  return db.query(query, values)
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    });
};

const getAllPlayersForGame = (gameId) => {
  const query = `SELECT * FROM players WHERE game_id = $1;`;
  const values = [gameId];
  return db.query(query, values)
    .then((res) => {
      return res.rows;
    });
};

module.exports = { addPlayer, getAllPlayersForGame, getPlayerById, getPlayerByUUID };
