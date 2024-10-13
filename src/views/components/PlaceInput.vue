<template>
    <div class="input-group">
        <input ref="searchInputDom" type="text" class="form-control"
            placeholder="Enter restaurant's name" />
        <span class="input-group-text">
            <i class="bi bi-geo-alt-fill"></i>
        </span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const searchInputDom = ref(null);
let autocomplete = null;
let placesService = null;

const loader = new Loader({
    apiKey: 'AIzaSyCSyP5_jP1x0ddEmPIHwC2MPZ18Rb84tv0', // the google map api key
    libraries: ['places'],
});

// Melbourne location bounds for search restriction
const melbourneBounds = {
    north: -37.500,
    south: -38.200,
    west: 144.500,
    east: 145.500,
};

const emit = defineEmits(['placeChange']);
onMounted(async () => {
    await loader.load();

    // Autocomplete setup
    const { Autocomplete } = await google.maps.importLibrary("places");
    autocomplete = new Autocomplete(searchInputDom.value, {
        bounds: melbourneBounds,
        strictBounds: true,
        types: ['restaurant'], // Restrict results to restaurants
    });

    // Relocate when user selects a place
    autocomplete.addListener('place_changed', () => {
        let placeInfo = autocomplete.getPlace();
        emit('placeChange', placeInfo);
    });
});

const getPlaceDetails = async(placeId) => {
    await loader.load();
    placesService = new google.maps.places.PlacesService(document.createElement('div'));
    return new Promise((resolve, reject) => {
        placesService.getDetails({ placeId: placeId }, (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(result);
            } else {
                reject(status);
            }
        });
    });
}

defineExpose({ getPlaceDetails });
</script>
