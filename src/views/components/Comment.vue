<template>
    <!-- Comments -->
    <div v-if="modelValue.length > 0" class="card mt-3" v-for="comment in modelValue" :key="comment.id">
        <div class="card-body">
            <div class="d-flex justify-content-between mb-1">
                <div class="d-flex flex-row align-items-center">
                    <i class="bi bi-person-circle"></i>
                    <p class="small mb-0 ms-2">{{ comment.userId }}</p>
                </div>
                <div class="d-flex align-items-center ms-auto">
                    <label class="mb-0 mx-2 text-muted">Rating:</label>
                    <StarRating v-model="comment.rating" />
                </div>
            </div>
            <p>{{ comment.content }}</p>
            <small class="text-muted small">{{ comment.createdAt?.toLocaleString() }}</small>
        </div>
    </div>
    <div v-else class="alert alert-info mt-5">No comments yet. &emsp; Come on, leave the first comment ...</div>

    <hr class="my-4" />

    <form @submit.prevent="submitComment" data-mdb-input-init class="form-outline">
        <div class="d-flex flex-row align-items-center p-2">
            <i class="bi bi-person-circle"></i>
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
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { fetchComments, postComment } from '@/stores/comment';
import StarRating from '@/components/StarRating.vue';

const { user } = useAuthStore();
const newRating = ref(0);
const newComment = ref("");

const props = defineProps({
    modelValue: {
        type: Array,
        default: [],
    },
    placeId: {
        type: String,
        required: true,
    },
});

// update comments when placeId changes
watch(() => props.placeId, newPlaceId => updateComments(newPlaceId));

// fetch comments when component is mounted
onMounted(() => updateComments(props.placeId));

// function to update comments based on placeId
const emit = defineEmits(['update:modelValue']);
const updateComments = async (placeId) => {
    props.modelValue.value = await fetchComments(placeId);
    emit('update:modelValue', props.modelValue.value);
}

// function to submit comment
const submitComment = async () => {
    postComment(props.placeId, newRating.value, newComment.value)
        .then(() => {
            newComment.value = "";
            newRating.value = 0;
            updateComments(props.placeId);
        })
        .catch((error) => {
            alert(error);
        });
}
</script>


