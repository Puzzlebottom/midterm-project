// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('../lib/sass-middleware');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');
const secretKey = 'foobarbaz1234567foobarbaz1234567';
const express = require('express');
const morgan = require('morgan');

const db = require('../db/connection.js');
const PORT = 8080;
const app = express();
const { checkPlayerCookie, checkUserCookie, givePlayerCookie, giveUserCookie, getPlayerNameByCookie, getUserIdByCookie } = require('./cookies/cookie');

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(cookieParser(secretKey));
app.use(cookieEncrypter(secretKey));
app.use(express.urlencoded({ extended: true }));
app.use(
  '../styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

app.get('/setcookies', function(req, res) {
  const cookieParams = {
    httpOnly: true,
    signed: true,
    maxAge: 300000000,
  };
});

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const newGameRoutes = require('./routes/games/new');
const joinGameRoutes = require('./routes/games/join');
const loginRoutes = require('./routes/authorization/login');
const registerRoutes = require('./routes/authorization/register');
const logoutRoutes = require('./routes/authorization/logout');
const mapRoutes = require('./routes/api/maps-api/map');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/games/new', newGameRoutes);
app.use('/games/join', joinGameRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);
app.use('/map', mapRoutes);


app.get('/', (req, res) => {
  const hasCookie = checkPlayerCookie(req);
  console.log(hasCookie, '<==== COOKIE TRUE OR FALSE');
  if (!hasCookie) {
    givePlayerCookie(res);
  } else {
    getPlayerNameByCookie(req.cookies);
  }
  res.render('index', { apiKey: process.env.API_KEY });
});

app.post('/saveMarker', (req, res) => {
  const location = JSON.stringify(req.body);
  console.log(location);

  const queryString = `
  INSERT INTO hiding_spots (location)
  VALUES ($1)
  RETURNING *;
  `;

  const queryValues = [location]; // Save the coordinates as a single string: "(lat, lng)"

  return db.query(queryString, queryValues)
    .then((result) => res.send(result.rows[0]))
    .catch((error) => {
      console.log("ERROR: ", error.message);
      res.status(500).json({ error: "Error saving marker in the database." });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
