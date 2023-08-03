const { addHidingSpot, getHidingSpotById } = require('../../db/queries/hidingSpots');

const addMarkerListener = (map) => {
  map.addListener('click', (e) => {
    let clue = prompt('Please enter a clue for this location');
    const player = JSON.parse(('#player-info').val());
    console.log('CLUE!!! ==> ', clue);
    if (clue) {
      const position = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      saveMarker(position, player, clue)
        .then((marker) => placeMarker(marker, map))
        .catch((err) => console.log(err));
    }
  });
};

const getStaticImageURL = async (lat, lng) => {
  return `https://maps.googleapis.com/maps/api/streetview?size=300x300&location=${lat},${lng}&fov=80&heading=70&pitch=0&key=${process.env.API_KEY}`
};

const createMarker = (position) => {
  return new google.maps.Marker({
    position: position,
    title: "New marker!"
  });
};

const saveMarker = (position, player, clue) => {
  const lat = position.lat;
  const lng = position.lng;
  const imgURL = getStaticImageURL(lat, lng)

  const gameId = player.game_id;
  const playerId = player.id;


  const payload = { location: { lat, lng }, picture: imgURL, gameId, playerId, clue };

  return $.ajax({
    type: "POST",
    url: "/hiding_spots",
    data: payload
  })
    .then((res) => {
      const { lat, lng } = res.location;
      return createMarker({ lat: Number(lat), lng: Number(lng) });//moar data
    }).catch((err) => console.log(err));
};

const placeMarker = (marker, map) => marker.setMap(map);

module.exports = { saveMarker, placeMarker }
