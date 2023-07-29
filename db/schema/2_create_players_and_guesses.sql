DROP TABLE IF EXISTS guesses CASCADE;
DROP TABLE IF EXISTS players CASCADE;

CREATE TABLE players(
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE guesses(
  id SERIAL PRIMARY KEY NOT NULL,
  player_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);