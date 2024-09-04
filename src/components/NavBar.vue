<template>
    <nav class="navbar navbar-expand-md navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Logo</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mynavbar">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                </ul>
                <form class="d-flex mx-3">
                    <button @click="switchState" class="nav-link">{{ user ? 'Logout' : 'Login' }}</button>
                </form>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue';

const router = useRouter()
const { user, removeUser } = useUserStore()

const switchState = () => {
    if (user) {
        removeUser()
    }
    router.push('/login')
}

onMounted(() => {
    console.log("user", user)
})

</script>
