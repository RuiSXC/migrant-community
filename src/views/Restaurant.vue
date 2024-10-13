<template>
    <div id="map-panel" class="card my-3">
        <div class="card-header">
            <div class="row">
                <h3>Your Culinary Journey: Search, Review, and Book Restaurants</h3>
                <div class="col-md-6">
                    Welcome to restaurant channel! Here, you can easily find restaurants, reservation, plan route and insight into safety information. Have a good journey. Explore now!
                </div>
                <div class="col-md-6 d-flex flex-column justify-content-end mt-2">
                    <PlaceInput @placeChange="handlePlaceChange" />
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
                        <i class="bi bi-cursor"></i> Get Directions
                    </a>
                    <router-link v-if="place" class="btn btn-outline-success btn-sm me-2" :to="{
                            name: 'reservation',
                            query: { 
                                placeId: place.place_id
                            }
                        }">
                        <i class="bi bi-clipboard-check"></i> Booking
                    </router-link>
                    <router-link v-if="place.localGovernmentArea && place.suburbTownName" class="btn btn-outline-danger btn-sm me-2" :to="{
                            name: 'safety-insight',
                            query: {
                                localGovernmentArea: place.localGovernmentArea,
                                suburbTownName: place.suburbTownName
                            }
                        }">
                        <i class="bi bi-shield-exclamation"></i> Safety insight
                    </router-link>
                </div>
            </RestaurantCard>
        </div>
        <Comment :placeId="place.place_id" v-model="comments" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import GoogleMap from '@/components/GoogleMap.vue';
import Comment from './components/Comment.vue';
import PlaceInput from './components/PlaceInput.vue';
import RestaurantCard from './components/RestaurantCard.vue';

const mapRef = ref(null);
const place = ref(null);
const comments = ref([]);

const avgRating = computed(() => (Math.floor(comments.value.reduce((acc, comment) => acc + comment.rating, 0) / comments.value.length) || 0))

const handlePlaceChange = (newPlace) => {
    for (const component of newPlace.address_components) {
        if (component.types.includes("administrative_area_level_2")) {
            newPlace.localGovernmentArea = component.short_name;
        } else if (component.types.includes("locality")) {
            newPlace.suburbTownName = component.short_name;
        }
    }
    place.value = newPlace;
    mapRef.value.locate(place.value );
}
</script>
