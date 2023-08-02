const {getUserByUUID} = require('../../db/queries/users')

const validateUser = async (uuid, userId) => {
  const data = await getUserByUUID(uuid);
  if (data.rows.length === 0) {
    return false;
  }
  const validId = data.rows[0].id
  return userId === validId;
}

module.exports = {validateUser}
