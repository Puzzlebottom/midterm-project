
const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const center = { lat: 48.765812262773615, lng: 11.358355018307819 };
  const zoom = 1;
  const restriction = { latLngBounds: { north: 85, south: -85, east: -168, west: -167.999999 }, strictBounds: true };

  const mapOptions = { center, zoom, restriction };

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
    $('#bounds').val(JSON.stringify(bounds));
  });

  return map;
};



initMap();


module.exports = initMap;


