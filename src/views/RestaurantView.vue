<template>
    <NavBar />
    <div class="container mt-4">
        <h1 class="mb-4 text-center">Restaurant List</h1>
        <div class="row">
            <div class="col-md-4" v-for="restaurant in restaurants" :key="restaurant.id">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">{{ restaurant.name }}</h5>
                        <p class="text-muted">{{ restaurant.location }}</p>
                        <p class="text-muted truncate-text">{{ restaurant.description }}</p>
                        <RouterLink class="btn btn-outline-primary btn-sm"
                            :to="{ name: 'restaurant-detail', params: { id: restaurant.id } }">
                            View Details
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import NavBar from '@/components/NavBar.vue'

const db = getFirestore()
const restaurants = ref([])

const fetchRestaurants = async () => {
    const querySnapshot = await getDocs(collection(db, 'restaurants'))
    restaurants.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(restaurants.value)
}

onMounted(() => {
    fetchRestaurants()
})

</script>


<style scoped>
.truncate-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* Adjust the number of lines to display */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    /* Adjust based on font size */
    max-height: 5em;
    /* Adjust based on number of lines */
}
</style>
