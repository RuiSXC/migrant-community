<template>
  <div>
    <!-- Hero Section -->
    <section class="hero text-center py-5 bg-light">
      <div class="container">
        <h1 class="display-4">Explore Safe Dining in Melbourne</h1>
        <p class="lead">Find, review, and reserve restaurants with confidence.</p>
        <router-link :to="{ name: 'restaurant' }">
            <el-button type="primary" size="large">
              Get Started
            </el-button>
          </router-link>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <el-icon size="60">
              <i class="bi bi-search"></i>
            </el-icon>
            <h3>Search Restaurants</h3>
            <p>Find nearby restaurants with detailed ratings and reviews.</p>
          </div>
          <div class="col-md-4 mb-4">
            <el-icon size="60">
              <i class="bi bi-map"></i>
            </el-icon>
            <h3>Plan Your Route</h3>
            <p>Get route suggestions while considering local safety conditions.</p>
          </div>
          <div class="col-md-4 mb-4">
            <el-icon size="60">
              <i class="bi bi-calendar-check"></i>
            </el-icon>
            <h3>Book Instantly</h3>
            <p>Reserve your table and receive instant email confirmation.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ElButton, ElIcon } from 'element-plus';
</script>

<style scoped>
.hero {
  /* background-image: url('https://source.unsplash.com/1600x600/?restaurant'); */
  background-image: url('@/assets/images/hero.jpg');
  background-size: cover;
  color: black;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.features .bi {
  font-size: 2rem;
  color: #007bff;
}
</style>
