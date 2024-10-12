<template>
  <NavBar v-if="showNavBar"/>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/views/components/NavBar.vue';

const route = useRoute();
const showNavBar = computed(() => route.meta.showNavBar ?? true);
</script>
