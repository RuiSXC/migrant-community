<template>
    <div ref="googleMapDom" style="height: 30rem;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const googleMapDom = ref(null);
let googleMap = null;
let infoWindow = null;
let destMarker = null;
let directionsService = null;
let directionsRenderer = null;

const props = defineProps({
    latLngBounds: {
        type: Object,
        default: {    // Melbourne location bounds for search restriction
            north: -37.500,
            south: -38.200,
            west: 144.500,
            east: 145.500,
        },
    },
    center: {
        type: Object,
        default: {    // Melbourne Center
            lat: -37.8136,
            lng: 144.9631,
        }
    },
});

const loader = new Loader({
    apiKey: 'AIzaSyCSyP5_jP1x0ddEmPIHwC2MPZ18Rb84tv0', // the google map api key
    libraries: ['places'],
});

onMounted(async () => {
    await loader.load();

    // initialise google map
    googleMap = new google.maps.Map(googleMapDom.value, {
        center: props.center, // Melbourne Center
        zoom: 8,
        restriction: {
            latLngBounds: props.latLngBounds,
            strictBounds: true,
        },
    });
    
    // initialise info window
    infoWindow = new google.maps.InfoWindow();

    // initialise directions
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: googleMap,
    });
});

// Function to locate a place and set a marker
const locate = (place) => {
    if (!place?.geometry?.location) {
        throw new Error('Please enter a valid location');
    }

    clearMap();
    googleMap.panTo(place.geometry.location);

    // Create a new marker
    destMarker = new google.maps.Marker({
        map: googleMap,
        position: place.geometry.location,
    });

    destMarker.addListener('click', () => {
        const contentString = `
            <div style="max-width: 20rem;">
                <h5>${place.name}</h5>
                <p class="text-muted">${place.vicinity}</p>
                <img
                    src="${place.photos[0].getUrl()}"
                    alt="${place.name}"
                    style="max-width: 100%"
                />
            </div>
        `;
        infoWindow.setContent(contentString);
        infoWindow.open(googleMap, destMarker);
    });
};

const route = (place) => {
    if (!place?.geometry?.location) {
        throw new Error('Please enter a valid location');
    }

    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
    }
    
    clearMap();
    navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        calculateAndDisplayRoute(currentLocation, place.geometry.location);
    });
};

const calculateAndDisplayRoute = (origin, destination) => {
    directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,    // 'DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'
    }, (response, status) => {
        if (status !== google.maps.DirectionsStatus.OK) {
            throw new Error('Directions request failed, ' + status);
        }
        // render route on the map
        directionsRenderer.setDirections(response);
    });
};

const clearMap = () => {
    infoWindow?.close();
    destMarker?.setMap(null);
    directionsRenderer?.setDirections({ routes: [] });     // clear previous routes
}

defineExpose({ locate, route });
</script>
