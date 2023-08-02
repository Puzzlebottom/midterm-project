const db = require('../connection');

const addMap = async (mapData) => {
  const {center, restriction, zoom} = mapData;
  const query = 'INSERT INTO maps (center, restriction, zoom) VALUES ($1, $2, $3) RETURNING *;'
  const values = [center, restriction, zoom];

  const data = await db.query(query, values);
  return data.rows[0];
}

module.exports = { addMap }
