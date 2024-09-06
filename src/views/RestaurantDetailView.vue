<template>
    <NavBar />
    <div class="container mt-4">
        <div v-if="restaurant">
            <div class="row mb-4">
                <div class="col-md-8 offset-md-2">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h1 class="card-title">{{ restaurant.name }}</h1>
                            <p class="card-text">Location: {{ restaurant.location }}</p>
                            <p class="card-text">Description: {{ restaurant.description }}</p>
                            <p class="text-warning">Average Rating: {{ restaurant.rating }}</p>

                            <form v-if="user.role === 'admin'" @submit.prevent="updateRating" class="mt-5">
                                <div class="mb-3">
                                    <label for="rating" class="form-label">Set New Rating</label>
                                    <input v-model="newRating" type="number" class="form-control" min="1" max="5"
                                        required>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore';
import NavBar from '@/components/NavBar.vue';

const { user } = useUserStore()

const db = getFirestore()
const params = useRoute().params
const restaurant = ref(null)
const newRating = ref(null)

const fetchRestaurant = async () => {
    const docRef = doc(db, 'restaurants', params.id)
    const docSnap = await getDoc(docRef)
    restaurant.value = docSnap.exists() ? docSnap.data() : null
}


const updateRating = async () => {
    await updateDoc(doc(db, 'restaurants', params.id), {
        rating: Number(newRating.value)
    })
    fetchRestaurant()
}

onMounted(() => {
    fetchRestaurant()
})

</script>