<template>
    <NavBar />
    <div class="row d-flex justify-content-center">
        <div class="col-md-8 my-5">
            <div v-if="restaurant" class="card shadow-0 border">
                <div class="card-header p-4">
                    <h1 class="card-title">{{ restaurant.name }}</h1>
                    <p class="card-text">Location: {{ restaurant.location }}</p>
                    <p class="card-text">Description: {{ restaurant.description }}</p>
                    <p class="text-warning">Average Rating: {{ avgRating }}</p>
                </div>
                <div class="card-body p-4">

                    <!-- Comments -->
                    <div class="card mb-4" v-for="comment in comments" :key="comment.id">
                        <div class="card-body">
                            <p>{{ comment.content }}</p>

                            <div class="d-flex justify-content-between">
                                <div class="d-flex flex-row align-items-center">
                                    <!-- todo: avatar -->
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp" alt="avatar"
                                        width="25" height="25" />
                                    <p class="small mb-0 ms-2">{{ comment.userId }}</p>
                                </div>
                                <div class="d-flex align-items-center ms-auto">
                                    <label class="mb-0 mx-2 text-muted">Rating:</label>
                                    <StarRating v-model="comment.rating" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr class="my-5" />

                    <!-- New Comment -->
                    <form @submit.prevent="submitComment" data-mdb-input-init class="form-outline mb-4">
                        <div class="d-flex flex-row align-items-center p-2">
                            <!-- todo: avatar -->
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp" alt="avatar"
                                width="25" height="25" />
                            <p class="small mb-0 ms-2">{{ user.email }}</p>
                            <div class="d-flex align-items-center ms-auto">
                                <label class="mb-0 mx-2 text-muted">Your rating:</label>
                                <StarRating v-model="newRating" required />
                            </div>
                        </div>
                        <input v-model="newComment" type="text" class="form-control" placeholder="Type comment..."
                            required>
                        <button type="submit" class="btn btn-sm btn-outline-primary my-2 float-end">
                            + Add a note
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { doc, collection, addDoc, getDoc, getDocs, getFirestore } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore'
import NavBar from '@/components/NavBar.vue'
import StarRating from '@/components/StarRating.vue'

const { user } = useUserStore()

const db = getFirestore()
const params = useRoute().params
const restaurant = ref(null)
const comments = ref([])
const newRating = ref(0)
const newComment = ref("")
const avgRating = computed(() => (
    Math.floor(comments.value.reduce((acc, comment) => acc + comment.rating, 0) / comments.value.length)
    || 0))


const fetchRestaurant = async () => {
    const docRef = doc(db, 'restaurants', params.id)
    const docSnap = await getDoc(docRef)
    restaurant.value = docSnap.exists() ? docSnap.data() : null
}

const fetchComments = async () => {
    const querySnapshot = await getDocs(collection(db, 'comments'))
    comments.value = querySnapshot.docs
        .filter(doc => doc.data().restaurantId === params.id)
        .map(doc => ({ id: doc.id, ...doc.data() }))
    console.log(comments.value)
}

const submitComment = async () => {
    console.log("newComment", newComment.value)
    if (!newRating.value || !newComment.value) {
        alert("Please provide a rating and a comment.")
        return;
    }

    await addDoc(collection(db, 'comments'), {
        restaurantId: params.id,
        userId: user.email, // Example user ID, replace with actual user ID
        rating: Number(newRating.value),
        content: newComment.value,
        createdAt: new Date()
    })
    await fetchComments()
    newRating.value = null
    newComment.value = null
}

onMounted(() => {
    fetchRestaurant()
    fetchComments()
})

</script>
