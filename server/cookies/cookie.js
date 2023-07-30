const { v4: uuidv4 } = require('uuid');

const checkCookie = function (request) {
  const cookie = request.cookies;
  console.log('COOKIE = ', cookie)
  return cookie ? true : false;
}

module.exports = {checkCookie};