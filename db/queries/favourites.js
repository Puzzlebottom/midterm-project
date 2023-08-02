const db = require('../connection');

const getAllFavourites = async () => {
  const query = 'SELECT * FROM maps JOIN favourites ON favourites.map_id = maps.id;';

  const data = await db.query(query);
  return data.rows;
};

const getFavouritesByUserId = async (userId) => {
  const query = `
  SELECT map_id FROM favourites
  JOIN maps ON map_id = maps.id
  JOIN users ON user_id = users.id
  WHERE users.id = $1;
  `;
  const values = [userId];

  const data = await db.query(query, values);
  return data.rows;
};

const addFavourite = async (userId, mapId) => {
  const query = `INSERT INTO favourites (user_id, map_id) VALUES ($1, $2) RETURNING *;`;
  const values = [userId, mapId];

  const data = await db.query(query, values);
  return data.rows;
};

module.exports = { addFavourite, getAllFavourites, getFavouritesByUserId };
