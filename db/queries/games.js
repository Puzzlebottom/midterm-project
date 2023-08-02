const db = require('../connection');

const addGame = async (gameData) => {
  const {mapId, ownerId, linkURL} = gameData;

  const query = 'INSERT INTO games (map_id, owner_id, link_url) VALUES ($1, $2, $3) RETURNING *;'
  const values = [mapId, ownerId, linkURL]

  const data = await db.query(query, values);
  return data.rows[0];
}

const getAllActiveGames = async () => {
  const query = `
  SELECT users.name AS owner_name, games.*, maps.*
  FROM games
  JOIN users ON users.id = games.owner_id
  JOIN maps ON maps.id = games.map_id
  WHERE games.started_at IS NULL
  GROUP BY games.id, users.name, maps.id
  ORDER BY games.id;`

  const data = await db.query(query);
  return data.rows;
}

const getGameById = async (gameId) => {
  const query = `
  SELECT users.name AS owner_name, games.*, maps.*
  FROM games
  JOIN users ON users.id = games.owner_id
  JOIN maps ON maps.id = games.map_id
  WHERE games.id = $1
  GROUP BY games.id, users.name, maps.id;`;
  const values = [gameId];

  const data = await db.query(query, values);
  if (data.rows.length === 0) {
    return null;
  }

  return data.rows[0];
}

module.exports = { addGame, getAllActiveGames, getGameById }
