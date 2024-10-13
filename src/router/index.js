import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import Restaurant from '@/views/Restaurant.vue';
import Reservation from '@/views/Reservation.vue';
import SafetyInsight from '@/views/SafetyInsight.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { showNavBar: false } 
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { showNavBar: false }
  },
  { 
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurant',
    name: 'restaurant',
    component: Restaurant,
    meta: { requiresAuth: true }
  },
  {
    path: '/reservation',
    name: 'reservation',
    component: Reservation,
    meta: { requiresAuth: true }
  },
  {
    path: '/safety-insight',
    name: 'safety-insight',
    component: SafetyInsight,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.user;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
