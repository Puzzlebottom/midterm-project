const db = require('../connection');

const addHidingSpot = (hidingSpotData) => {
  const queryString = `
  INSERT INTO hiding_spots (location, player_id, game_id, picture, clue)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`;
  const { location, playerId, gameId, picture, clue } = hidingSpotData;
  const values = [location, playerId, gameId, picture, clue];
  return db.query(queryString, values)
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      }
      console.log(res.rows[0]);
      return res.rows[0]
    })
};

const getHidingSpotById = (hidingSpotId) => {
  const queryString = `
  SELECT * FROM hiding_spots
  WHERE id = $1;`;
  const values = [hidingSpotId];
  return db.query(queryString, values)
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      }
      console.log(res.rows[0]);
      return res.rows[0];
    })
};

const getHidingSpotForPlayer = (playerId) => {
  const query = `SELECT * FROM hiding_spots WHERE player_id = $1;`;
  const values = [playerId];
  return db.query(query, values)
    .then((data) => {
      if (data.rows.length === 0) {
        return null;
      }
      return data.rows[0]
    })
}

const getAllHidingSpotsForGame = (gameId) => {
  const query = `SELECT * FROM hiding_spots WHERE game_id = $1;`;
  const values = [gameId];
  return db.query(query, values).then((res) => {
    console.log(res.rows);
    return res.rows;
  })
}

module.exports = { addHidingSpot, getHidingSpotById, getHidingSpotForPlayer, getAllHidingSpotsForGame }
