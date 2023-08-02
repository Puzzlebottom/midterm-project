const db = require('../connection');

const addGame = async (gameData) => {
  const {mapId, ownerId, linkURL} = gameData;

  const query = 'INSERT INTO games (map_id, owner_id, link_url) VALUES ($1, $2, $3) RETURNING *;'
  const values = [mapId, ownerId, linkURL]

  const data = await db.query(query, values);
  return data.rows[0];

}

module.exports = { addGame }
