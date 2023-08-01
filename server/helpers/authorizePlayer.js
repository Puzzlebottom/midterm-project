// see if they have a req.cookies.player

// get player name with playerCookie

// get gameId for player

// clear player cookie

// check if playerCookie belongs to user (if logged in as user) else clear playerCookie


// NO PLAYER COOKIE, NOT LOGGED IN
// NO favourites (no GET, no POST)
// NO create game (no GET, no POST)
// LOOK BUT DON'T TOUCH community favourites (yes GET, no POST)
// on JOIN GAME (POST) create player assign playerCookie

// HAVE PLAYER COOKIE NOT LOGGED IN
// NO favourites (no GET, no POST)
// NO create game (no GET, no POST)
// LOOK BUT DON'T TOUCH community favourites (yes GET, no POST)
// on JOIN GAME (POST) getGameIdForPlayer() if active redirect to gameID


// ARE LOGGED IN BUT NO PLAYER COOKIE
// go everwhere
// on CREATE GAME or JOIN GAME (POSTS) create player assign playerCookie
