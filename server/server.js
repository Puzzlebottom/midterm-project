// load .env data into process.env
require('dotenv').config();

// import checkCookie.js
const {checkCookie} = require('./cookies/cookie');

// Web server config
const sassMiddleware = require('../lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(cookieParser());
app.use(morgan('dev'));
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

const newGameRoutes = require('./routes/new-game');
const joinGameRoutes = require('./routes/join-game');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/new-game', newGameRoutes);
app.use('/join-game', joinGameRoutes);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  const hasCookie = checkCookie(req);
  res.render('index', { apiKey: process.env.API_KEY });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
