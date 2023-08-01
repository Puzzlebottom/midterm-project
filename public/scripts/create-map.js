
const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const lat = -34.397;
  const lng = 150.644;
  const zoom = 8;

  console.log("LAT : ", lat)
  console.log("LNG: ", lng)
  console.log("ZOOM", zoom)



  const mapData = { center: { lat, lng }, zoom: zoom };

  const map = await new Map(document.getElementById("map"), mapData);

  map.addListener('center_changed', () => {
    const center = map.getCenter();
    $('#lat-input').val(center.lat)
    $('#lng-input').val(center.lng)
  })

  map.addListener('zoom_changed', () => {
    const zoom = map.getZoom();
    $('#zoom-input').val(zoom)
  })

  map.addListener('bounds_changed', () => {
    const bounds = map.getBounds()
    console.log('BOUNDS: ', bounds)
    $('#bounds-input').val(bounds.toString())
    console.log($('#bounds-input').val())
  })



  return map;
};



initMap();


module.exports = initMap;


