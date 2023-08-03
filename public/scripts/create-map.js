const { saveMarker, placeMarker } = require('./hiding-spots');

const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const mapObject = JSON.parse($('#map-options').attr('data-map-options'));
  const mapOptions = { center: mapObject.center, zoom: mapObject.zoom, restriction: mapObject.restriction }


  console.log("MAP OPTIONS:", mapOptions);

  const map = await new Map(document.getElementById("map"), mapOptions);

  map.addListener('center_changed', () => {
    const center = map.getCenter();
    $('#center').val(JSON.stringify(center));
  });

  map.addListener('zoom_changed', () => {
    const zoom = map.getZoom();
    $('#zoom').val(zoom);
  });

  map.addListener('bounds_changed', () => {
    const bounds = map.getBounds();
    const restriction = { latLngBounds: bounds, strictBounds: true }
    $('#bounds').val(JSON.stringify(restriction));
  });

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


  return map;
};



initMap();


module.exports = initMap;


