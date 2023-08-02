
const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const lat = 28.87396386289182;
  const lng = 19.44429251830782;
  const zoom = 2;

  console.log("LAT : ", lat)
  console.log("LNG: ", lng)
  console.log("ZOOM", zoom)



  const mapData = { center: { lat, lng }, zoom: zoom };

  const map = await new Map(document.getElementById("map"), mapData);

  map.addListener('center_changed', () => {
    const center = map.getCenter();
    $('#center').val(JSON.stringify(center))
  })

  map.addListener('zoom_changed', () => {
    const zoom = map.getZoom();
    $('#zoom').val(zoom)
  })

  map.addListener('bounds_changed', () => {
    const bounds = map.getBounds()
    console.log('BOUNDS: ', bounds)
    $('#bounds').val(JSON.stringify(bounds))
    console.log($('#bounds').val())
  })



  return map;
};



initMap();


module.exports = initMap;


