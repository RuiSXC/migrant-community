<template>
    <div class="row ">
        <div class="col-md-6 order-md-2 text-md-end p-3">
            <img :src="place.photos[0].getUrl()" class="img-fluid mw-100" style="max-height: 20rem"
                alt="the photo of the place" />
        </div>
        <div class="col-md-6 order-md-1 p-3">
            <h2 class="fw-bold">{{ place.name }}</h2>
            <p class="text-muted fst-italic">Address: {{ place.vicinity }}</p>
            <p class="text-muted">Now is {{ place.opening_hours.isOpen() ? 'Opened' : 'Closed' }}</p>
            <p class="text-muted">Call: {{ place.international_phone_number }}</p>
            <p class="text-muted">Website: {{ place.website }}</p>
            <p class="text-muted">Average Rating: {{ avgRating || 'no rating' }}</p>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    place: {
        type: Object,
        required: true
    },
    avgRating: {
        type: Number,
        required: false
    }
})
</script>