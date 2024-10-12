<template>
    <div class="card my-3">
        <div class="card-header">
            <div class="row">
                <div class="col-md-6">
                    <h3>Restaurants with ratings</h3>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                        <input ref="searchInputDom" type="text" class="form-control"
                            placeholder="Enter restaurant's name" />
                        <span class="input-group-text">
                            <i class="bi bi-geo-alt-fill"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div ref="googleMapDom" style="height: 30rem;"></div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const searchInputDom = ref(null);
const googleMapDom = ref(null);
const googleMap = ref(null);
const autocomplete = ref(null);

let startMarker, destMarker;

const loader = new Loader({
    apiKey: 'AIzaSyCSyP5_jP1x0ddEmPIHwC2MPZ18Rb84tv0',    // the google map api key
    libraries: ['places'],
})

// Melbourne location bounds for search restriction
const melbourneBounds = {
    north: -37.500,
    south: -38.200,
    west: 144.500,
    east: 145.500
};

onMounted(async () => {
    await loader.load();
    const { Map } = await google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");
    const { Autocomplete } = await google.maps.importLibrary("places");

    const infoWindow = new google.maps.InfoWindow(); // 创建信息窗口
    googleMap.value = new Map(googleMapDom.value, {
        center: { lat: -37.8136, lng: 144.9631 }, // Melbourne Center
        zoom: 8,
        restriction: {
            latLngBounds: melbourneBounds,
            strictBounds: true,
        },
    });

    // Autocomplete setup
    autocomplete.value = new Autocomplete(searchInputDom.value, {
        bounds: melbourneBounds,
        strictBounds: true,
        types: ['restaurant'], // Restrict results to restaurants
    });

    autocomplete.value.addListener('place_changed', () => {
        const place = autocomplete.value.getPlace();
        console.log(place);
        if (place && place.geometry && place.geometry.location) {
            googleMap.value.panTo(place.geometry.location);

            destMarker?.setMap(null)
            destMarker = new Marker({
                map: googleMap.value,
                position: place.geometry.location,
            });

            destMarker.addListener('click', () => {
                const contentString = `
                    <div>
                        <h5>${place.name}</h5>
                        <p class="text-muted">${place.vicinity}</p>
                        <img
                            src="${place.photos ? place.photos[0].getUrl() : 'default-image-url'}"
                            alt="${place.name}"
                            style="max-width: 15rem;"
                        />
                    </div>
                `;
                infoWindow.setContent(contentString);
                infoWindow.open(googleMap.value, destMarker);
            });

            googleMap.value.setCenter(place.geometry.location);
            googleMap.value.setZoom(12);
        }
    });

});
</script>