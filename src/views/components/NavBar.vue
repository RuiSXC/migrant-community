<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand mx-sm-5" href="#">
            <img src="@/assets/images/logo.png" height="50" alt="Logo">
        </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mynavbar">
              <ul class="navbar-nav me-auto">
                  <li class="nav-item">
                      <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link :to="{ name: 'restaurant' }" class="nav-link">Restaurant</router-link>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="#">Link</a>
                  </li>
              </ul>
              <button @click="handleLogout" class="nav-link">Logout</button>
          </div>
      </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  authStore.logout()
    .then(() => router.push({ name: 'login' }))
    .catch((error) => console.log(error));
};
</script>