
const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const mapObject = JSON.parse($('#map-options').attr('data-map-options'));
  const mapOptions = {center: mapObject.center, zoom: mapObject.zoom, restriction: mapObject.restriction}


  console.log("MAP OPTIONS:", mapOptions);



  // const center = { lat: 48.765812262773615, lng: 11.358355018307819 };
  // const zoom = 1;
  // const restriction = { latLngBounds: { north: 85, south: -85, east: -168, west: -167.999999 }, strictBounds: true };

  // const mapOptions = { center, zoom, restriction };

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
    const restriction = {latLngBounds: bounds, strictBounds: true}
    $('#bounds').val(JSON.stringify(restriction));
  });

  return map;
};



initMap();


module.exports = initMap;

