<template>
  <div class="container">
    <NavBar v-if="showNavBar"/>
    <router-view />
    <Footer v-if="showNavBar"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/views/components/NavBar.vue';
import Footer from '@/views/components/Footer.vue';

const route = useRoute();
const showNavBar = computed(() => route.meta.showNavBar ?? true);
</script>
