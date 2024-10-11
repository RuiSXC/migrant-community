<template>
  <NavBar v-if="showNavBar"/>
  <router-view />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/views/components/NavBar.vue';

const route = useRoute();
const showNavBar = computed(() => route.meta.showNavBar ?? true);
</script>
