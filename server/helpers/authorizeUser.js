// splash page: logged in: header shows username and logout button
//      can create, join, favourites -> give user_id in template vars to _header,

//                          logged in                           not
// community maps         validate user with cookie       look but no touch

// user favourites        validate and show               do nothing

// login --> no validation needed

// register --> no validation needed

// join game

// create game

const db = require('../../db/connection')
const {giveUserCookie} = require('../cookies/cookie')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');

const getUserCookie = () => uuidv4()

const assignUserCookie = (uuid, response) => {
  const cookieParams = { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }; //24 hours
  return response.cookie('user', uuid, cookieParams);
}

const getUserByCookie = (uuid) => {
  return db.query(`SELECT * FROM users WHERE cookie_uuid = $1 LIMIT 1`, [uuid])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => console.log(err));
}

const registerUser = (response, name, password) => {
  const cookieValue = getUserCookie()

  return bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const queryString = `
        INSERT INTO users (name, password, cookie_uuid)
        VALUES ($1, $2, $3)
        RETURNING *;`;
      const values = [name, hashedPassword, cookieValue];

      return db.query(queryString, values)
        .then((result) => {
          const user = result.rows[0];
          console.log(result.rows)
          return assignUserCookie(user.cookie_uuid, response)
        })
        .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
}


module.exports = {registerUser, getUserByCookie}
