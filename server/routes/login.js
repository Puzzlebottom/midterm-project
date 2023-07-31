// const express = require('express');
// const router = express.Router();
// // const argon2 = require('argon2');
// const bcrypt = require('bcrypt');
// const db = require('../../db/connection');

// router.get('/', (req, res) => {
//   res.render('login');
// });

// router.post('/', (req, res) => {
//   console.log('LOGGED IN!');
//   const { username, password } = req.body;
//   const queryString = `SELECT password FROM users WHERE name = $1;`

//   return db.query(queryString, [username])
//     .then((result) => {
//       return bcrypt.compareSync(password, result.rows[0].password)
//     })
//     .then((verified) => {
//       if (verified) {
//         console.log('Verified? ==> ', verified);
//         res.cookie('user', true, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
//         console.log('VERIFIED!')
//         res.redirect('/new-game');
//       } else {
//         console.log('INVALID CREDENTIALS!');
//         res.render('login', { error: 'Invalid username or password' });
//       }
//     }).catch((err) => console.log(err))

// })

// module.exports = router;
