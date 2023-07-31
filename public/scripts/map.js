
const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const $map = $('#map');
  const lat = Number($map.attr('data-lat'));
  const lng = Number($map.attr('data-lng'));
  const zoom = Number($map.attr('data-zoom'));

  console.log("LAT : ", lat)
  console.log("LNG: ", lng)
  console.log("ZOOM", zoom)

  const mapData = { center: { lat, lng }, zoom: zoom };



  return new Map(document.getElementById("map"), mapData);
};



initMap();


module.exports = initMap;
