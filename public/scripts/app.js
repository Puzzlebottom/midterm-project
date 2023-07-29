/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */

let map;

const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  console.log(map);
  return map;
};

$('#map-button').on('click', () => {
  initMap();
  console.log('MAP MEN');
});

