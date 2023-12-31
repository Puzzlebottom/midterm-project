DROP TABLE IF EXISTS hiding_spots CASCADE;

CREATE TABLE hiding_spots(
  id SERIAL PRIMARY KEY NOT NULL,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  location JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  picture VARCHAR(255),
  clue VARCHAR(255)
);
