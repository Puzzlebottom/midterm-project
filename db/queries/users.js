const db = require('../connection');

const getUserByUUID = async (uuid) => {
  const query = 'SELECT * FROM users WHERE cookie_uuid = $1';
  const values = [uuid];

  const data = await db.query(query, values);
  if (data.rows.length === 0) {
    return null;
  }

  return data.rows[0];
};

const getUserByUserName = async (username) => {
  const query = 'SELECT * FROM users WHERE name = $1';
  const values = [username];

  const data = await db.query(query, values);
  return data.rows;
};

const addUser = async (userData) => {
  const query = `INSERT INTO users (name, password, cookie_uuid)
  VALUES ($1, $2, $3) RETURNING *;`;
  const values = [userData.name, userData.password, userData.cookie_uuid];

  const data = await db.query(query, values);
  if (data.rows.length === 0) {
    return null;
  }

  return data.rows[0];
};

module.exports = { addUser, getUserByUserName, getUserByUUID };
