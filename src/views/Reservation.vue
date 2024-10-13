<template>
    <div class="card my-3">
        <div class="card-header">
            <div class="row">
                <div class="col-md-6">
                    <h3>Reservation</h3>
                    <p class="text-muted">Easily make a reservation. Do worry, I will info you when it's ready.</p>
                </div>
                <div class="col-md-6 d-flex align-items-center ">
                    <PlaceInput ref="placeInputRef" @placeChange="place => selectedPlace = place" />
                </div>
            </div>
        </div>
        <div v-if="selectedPlace" class="card-body">
            <RestaurantCard :place="selectedPlace" />
            <hr class="my-3" />
            <BookingForm />
        </div>
        <div v-else class="card-body d-flex justify-content-center align-items-center" style="height: 80vh;">
            <p class="display-5 text-secondary">Please select a place first</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import PlaceInput from './components/PlaceInput.vue';
import BookingForm from './components/BookingForm.vue';
import RestaurantCard from './components/RestaurantCard.vue';

const placeInputRef = ref(null);
const selectedPlace = ref(null);
const route = useRoute();

onMounted(async () => {
    const { placeId } = route.query;
    if (placeId) {
        selectedPlace.value = await placeInputRef.value?.getPlaceDetails(placeId);
    }
});
</script>
