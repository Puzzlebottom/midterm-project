const express = require('express');
const router = express.Router();
const { addHidingSpot, getHidingSpotById } = require('../db/queries/hidingSpots');


const addMarkerListener = (map) => {
  map.addListener('click', (e) => {
    let confirmation = confirm('Set marker?');
    if (confirmation) {
      const position = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      saveMarker(createMarker(position))
        .then((marker) => placeMarker(marker, map))
        .catch((err) => console.log(err));
    }
  });
};

const createMarker = (position) => {
  return new google.maps.Marker({
    position: position,
    title: "New marker!"
  });
};

const saveMarker = (marker) => {
  const lat = marker.position.lat;
  const lng = marker.position.lng;
  const payload = { lat, lng };

  return $.ajax({
    type: "POST",
    url: "/saveMarker",
    data: payload
  })
    .then((res) => {
      const { lat, lng } = res.location;
      return createMarker({ lat: Number(lat), lng: Number(lng) });
    });
};