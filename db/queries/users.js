const db = require('../connection');

const getUserByUUID = async (uuid) => {
  const query = 'SELECT * FROM users WHERE cookie_uuid = $1'
  const values = [uuid]

  const data = await db.query(query, values)
  if (data.rows.length === 0) {
    return null;
  }

  return data.rows[0]
};

module.exports = { getUserByUUID };
