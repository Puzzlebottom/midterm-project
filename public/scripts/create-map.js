const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const mapObject = JSON.parse($('#map-options').attr('data-map-options'));
  const mapOptions = { center: mapObject.center, zoom: mapObject.zoom, restriction: mapObject.restriction }


  const map = new Map(document.getElementById("map"), mapOptions);

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

  return map;
};

initMap();


module.exports = initMap;


