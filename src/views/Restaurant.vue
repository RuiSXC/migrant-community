<template>
    <div id="map-panel" class="card my-3">
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
            <GoogleMap ref="mapRef" />
        </div>
    </div>

    <div v-if="place" class="card my-3 p-3">
        <div class="card-header">
            <RestaurantCard :place="place" :avgRating="avgRating">
                <!-- control pannel -->
                <div class="mt-3">
                    <a @click="() => mapRef.route(place)" href="#map-panel" class="btn btn-primary btn-sm me-2">
                        <i class="bi bi-cursor-fill"></i> Get Directions
                    </a>
                    <router-link v-if="place.localGovernmentArea && place.suburbTownName" class="btn btn-outline-danger btn-sm me-2" :to="{
                            name: 'safety-insight',
                            query: {
                                localGovernmentArea: place.localGovernmentArea,
                                suburbTownName: place.suburbTownName
                            }
                        }">
                        <i class="bi bi-shield-fill-exclamation"></i> Safety insight
                    </router-link>
                </div>
            </RestaurantCard>
        </div>
        <Comment :placeId="place.place_id" v-model="comments" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import GoogleMap from '@/components/GoogleMap.vue';
import Comment from './components/Comment.vue';
import RestaurantCard from './components/RestaurantCard.vue';

const searchInputDom = ref(null);
const mapRef = ref(null);
const place = ref(null);
const comments = ref([]);
let autocomplete = null;

const avgRating = computed(() => (Math.floor(comments.value.reduce((acc, comment) => acc + comment.rating, 0) / comments.value.length) || 0))

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

onMounted(async () => {
    await loader.load();
    const { Autocomplete } = await google.maps.importLibrary("places");

    // Autocomplete setup
    autocomplete = new Autocomplete(searchInputDom.value, {
        bounds: melbourneBounds,
        strictBounds: true,
        types: ['restaurant'], // Restrict results to restaurants
    });

    // Relocate when user selects a place
    autocomplete.addListener('place_changed', () => {
        let placeinfo = autocomplete.getPlace();
        for (const component of placeinfo.address_components) {
            if (component.types.includes("administrative_area_level_2")) {
                placeinfo.localGovernmentArea = component.short_name;
            } else if (component.types.includes("locality")) {
                placeinfo.suburbTownName = component.short_name;
            }
        }
        place.value = placeinfo;
        mapRef.value.locate(place.value );
    });
});
</script>
