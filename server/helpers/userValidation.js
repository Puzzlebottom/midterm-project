const { addUser, getUserByUserName, getUserByUUID } = require('../../db/queries/users');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


const getUserCookie = () => uuidv4();

const assignUserCookie = (uuid, response) => {
  const cookieParams = { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }; //24 hours
  return response.cookie('user', uuid, cookieParams);
};

const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const loginUser = async (response, request) => {
  const { username, password } = request.body;
  const validUsers = await getUserByUserName(username);

  for (const user of validUsers) {
    const isValid = await checkPassword(password, user.password);
    if (isValid) {
      return assignUserCookie(user.cookie_uuid, response);
    }
  }

  response.send('No user matching that username and password.');

};

const registerUser = async (response, userData) => {
  const cookie = getUserCookie();
  const { username, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await addUser({ name: username, password: hashedPassword, cookie_uuid: cookie });
  return assignUserCookie(user.cookie_uuid, response);
};

const validateUser = async (uuid, userId) => {
  const data = await getUserByUUID(uuid);

  if (!data) {
    return false;
  };

  return Number(userId) === data.id;
};

module.exports = { loginUser, registerUser, validateUser };
