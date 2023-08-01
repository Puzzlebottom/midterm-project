
const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  const lat = -34.397;
  const lng = 150.644;
  const zoom = 8;

  console.log("LAT : ", lat)
  console.log("LNG: ", lng)
  console.log("ZOOM", zoom)



  const mapData = { center: { lat, lng }, zoom: zoom };



  return new Map(document.getElementById("map"), mapData);
};



initMap();


module.exports = initMap;


