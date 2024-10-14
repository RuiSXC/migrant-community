<template>
  <nav class="navbar navbar-expand-lg navbar-primary" style="background-color: rgba(64,158, 255)">
      <div class="container-fluid">
        <a class="navbar-brand me-sm-5" href="#">
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
                    <router-link :to="{ name: 'safety-insight' }" class="nav-link">Safety Insight</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link :to="{ name: 'reservation' }" class="nav-link">Reservation</router-link>
                  </li>
                  <li class="nav-item">
                      <router-link :to="{ name: 'immigration' }" class="nav-link">Immigration</router-link>
                  </li>
                  <li v-if="user?.role === 'admin'" class="nav-item">
                      <router-link :to="{ name: 'admin' }" class="nav-link">Admin</router-link>
                  </li>
              </ul>
              <button v-if="user" @click="handleLogout" class="nav-link">Logout</button>
          </div>
      </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = authStore.user

const handleLogout = async () => {
  authStore.logout()
    .then(() => router.push({ name: 'login' }))
    .catch((error) => console.log(error));
};
</script>