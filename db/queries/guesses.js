const db = require('../connection');

const addGuess = (location) => {
  const queryString = `
  INSERT INTO guesses (location)
  VALUES ($1)
  RETURNING *;`;
  const values = [location];
  return db.query(queryString, values)
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      }
      console.log(res.rows[0]);
      return res.rows[0]
    })
}

const getGuessById = (guessId) => {
  const queryString = `
  SELECT * FROM guesses
  WHERE id = $1;`;
  const values = [guessId];
  return db.query(queryString, values)
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      }
      console.log(res.rows[0]);
      return res.rows[0];
    })
};

const getAllGuessesForPlayer = (playerId) => {
  const query = `SELECT * FROM guesses WHERE player_id = $1;`;
  const values = [playerId];
  return db.query(query, values).then((res) => {
    console.log(res.rows);
    return res.rows;
  })
}

const getAllGuessesForGame = (gameId) => {
  const query = `SELECT * FROM guesses WHERE game_id = $1;`;
  const values = [gameId];
  return db.query(query, values).then((res) => {
    console.log(res.rows);
    return res.rows;
  })
}

module.exports = { addGuess, getGuessById, getAllGuessesForPlayer, getAllGuessesForGame }
