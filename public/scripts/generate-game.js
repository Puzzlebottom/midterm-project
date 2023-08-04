const generateGame = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const mapObject = JSON.parse($('#map-options').attr('data-map-options'));
  const player = JSON.parse($('#player-info').attr('data-player-info'));
  const mapOptions = { center: mapObject.center, zoom: mapObject.zoom, restriction: mapObject.restriction };


  const map = new Map(document.getElementById("map"), mapOptions);

  map.addListener('click', (e) => {
    let clue = prompt('Please enter a clue for this location');
    if (clue) {
      const position = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      saveMarker(position, player, clue)
        .then((marker) => placeMarker(marker, map))
        .catch((err) => console.log(err));
    }
  });

  return map;
};

const createMarker = async (id, position, player_id, staticImageURL, clue) => {
  const { InfoWindow } = await google.maps.importLibrary("maps");

  const marker = new google.maps.Marker({
    position: position,
    title: clue
  });

  const infoWindow = new google.maps.InfoWindow();

  infoWindow.setContent(`<img src="${staticImageURL}" alt="a hiding spot"><div>${clue}</div>`);
  infoWindow.open(map, marker);

  return marker;
};

const saveMarker = (position, player, clue) => {
  const lat = position.lat;
  const lng = position.lng;

  const gameId = player.game_id;
  const playerId = player.id;


  const payload = { location: { lat, lng }, gameId, playerId, clue };

  return $.ajax({
    type: "POST",
    url: "/hiding_spots",
    data: payload
  })
    .then((res) => {
      const { lat, lng } = res.location;
      return createMarker(res.id, { lat: Number(lat), lng: Number(lng) }, res.player_id, res.picture, res.clue);
    })
    .catch((err) => console.log(err));
};

const placeMarker = (marker, map) => marker.setMap(map);


generateGame();


module.exports = generateGame;


