/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */

let map;
// let testVar;

const initMap = async () => {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,

  });
  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    new google.maps.Marker({
      position: mapsMouseEvent.latLng,
      map,
      title: "New marker on click!",
    });
    testVar = mapsMouseEvent.latLng;
    console.log(mapsMouseEvent.latLng, '<==== MAP MARKER!')

    fetch("/saveMarker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  });


  const marker = new google.maps.Marker({
    position: { lat: -34.397, lng: 150.644 },
    map,
    title: "Hello World!",
  }
  );
  marker.setMap(map);
  console.log(map);
  return map;
};
initMap();
// $('#map-button').on('click', () => {

//   console.log('MAP MEN');
// });






