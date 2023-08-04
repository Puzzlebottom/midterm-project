const db = require('../connection');

const getAllFavourites = async () => {
  const query = `
  SELECT maps.*, users.name AS owner_name
  FROM maps
  JOIN games ON games.map_id = maps.id
  JOIN users ON users.id = games.owner_id;`;

  const data = await db.query(query);
  return data.rows;
};

const getFavouritesByUserId = async (userId) => {
  if (!userId) {
    return [];
  }

  const query = `
  SELECT maps.*, owners.name AS owner_name
  FROM maps
  JOIN games ON games.map_id = maps.id
  JOIN users AS owners ON owners.id = games.owner_id
  JOIN favourites ON favourites.map_id = maps.id
  JOIN users AS favouriters ON user_id = favouriters.id
  WHERE favouriters.id = $1;
  `;
  const values = [userId];

  const data = await db.query(query, values);
  return data.rows;
};

const addFavourite = async (userId, mapId) => {
  const query = `INSERT INTO favourites (user_id, map_id) VALUES ($1, $2) RETURNING *;`;
  const values = [userId, mapId];

  const data = await db.query(query, values);
  if (data.rows.length === 0) {
    return null;
  }
  return data.rows[0];
};

const removeFavourite = async (userId, mapId) => {
  const query = `DELETE FROM favourites WHERE user_id = $1 AND map_id = $2;`;
  const values = [userId, mapId];

  await db.query(query, values);
  return true;
};

module.exports = { addFavourite, getAllFavourites, getFavouritesByUserId, removeFavourite };
