"use strict"

//Default starting location
let mapLat = 29.97;
let mapLon = -90.08;

mapboxgl.accessToken = MAP_key;
let map = initMap(mapLon, mapLat);
let marker;
let currentLocation = [mapLon, mapLat];

//Sets initial marker
marker = createMarker(currentLocation);

//Enables draggable marker
marker.setDraggable(true);

//Function to create map
function initMap(lon, lat) {
    mapboxgl.accessToken = MAP_key;
    return new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        maxZoom: 17,
        minZoom: 5,
        zoom: 10,
        center: [lon, lat]
    });
}

//Function to create a marker
function createMarker(coordinates) {
    if (marker) {
        marker.remove();
    }
    return new mapboxgl.Marker({draggable: true})
        .setLngLat(coordinates)
        .addTo(map);
}

//Click event for searching location with input field
$("#changeLocation").click(function () {
    geocode($("#newLocation").val(), MAP_key).then(function (result) {
        map.setCenter(result);
        map.setZoom(10);
        currentLocation.pop();
        currentLocation.pop();
        currentLocation.unshift(result[1]);
        currentLocation.unshift(result[0]);
        lat = currentLocation[1];
        lon = currentLocation[0];
        marker = createMarker({lat, lon});
        marker.on('dragend', function(e) {
            getData(e.target._lngLat.lat, e.target._lngLat.lng);
        })
        $('#forecast').html("");
        $('#locationName').html("");
        getData(lat, lon);
    })
});

//Click event for clicking on the map to get a new location
map.on('click', function (e) {
    marker = createMarker([e.lngLat.lng, e.lngLat.lat]);
    marker.on('dragend', function(e) {
        getData(e.target._lngLat.lat, e.target._lngLat.lng);
    })
    getData(e.lngLat.lat, e.lngLat.lng);
})

//Sets event for when you finish dragging the marker it will pull new data for that location
marker.on('dragend', function(e) {
    getData(e.target._lngLat.lat, e.target._lngLat.lng);
})

