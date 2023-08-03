const generateGame = async () => {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const mapObject = JSON.parse($('#map-options').attr('data-map-options'));
  const player = JSON.parse($('#player-info').attr('data-player-info'));
  const mapOptions = { center: mapObject.center, zoom: mapObject.zoom, restriction: mapObject.restriction }


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



const createMarker = (id, position, player_id, staticImageURL, clue) => {
  const $image = $(`<img src="${staticImageURL}" alt="Shh, I'm hiding here!">`)
  const $content = $('<div>')
    .append($image)

  const marker = new google.maps.AdvancedMarkerElement({
    position: position,
    title: clue
  });

  marker.content($content)
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


