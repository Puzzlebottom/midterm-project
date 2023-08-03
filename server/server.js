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
const loginRoutes = require('./routes/authorization/login');
const registerRoutes = require('./routes/authorization/register');
const logoutRoutes = require('./routes/authorization/logout');
const playerRoutes = require('./routes/players-api');


const gameRoutes = require('./routes/games');
const userRoutes = require('./routes/users');
const { getUserByUUID } = require('../db/queries/users');


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
// app.use('/games/new', newGameRoutes);
// app.use('/games/join', joinGameRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);
app.use('/players', playerRoutes);

app.use('/games', gameRoutes);
app.use('/users', userRoutes);

app.get('/', async (req, res) => {
  const cookie = req.cookies;

  const templateVars = { apiKey: process.env.API_KEY, user: null };

  if (cookie['user']) {
    const user = getUserByUUID(cookie['user']);

    templateVars.user = user;
  }
  return res.render('index', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
