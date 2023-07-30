// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('../lib/sass-middleware');
const cookieParser = require('cookie-parser')
const express = require('express');
const morgan = require('morgan');

const db = require('../db/connection.js');
const PORT = 8080;
const app = express();
const {checkCookie, giveCookie, getPlayerName } = require('./cookies/cookie')

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(cookieParser());
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

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const newGameRoutes = require('./routes/new-game');
const joinGameRoutes = require('./routes/join-game');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/new-game', newGameRoutes);
app.use('/join-game', joinGameRoutes);


app.get('/', (req, res) => {
  const hasCookie = checkCookie(req);
  console.log(hasCookie, '<==== COOKIE TRUE OR FALSE')
  if (!hasCookie) {
    giveCookie(res);
  } else {
    getPlayerName(cookie);
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