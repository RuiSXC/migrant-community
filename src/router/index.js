import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import Restaurant from '@/views/Restaurant.vue';
import Reservation from '@/views/Reservation.vue';
import SafetyInsight from '@/views/SafetyInsight.vue';
import Admin from '@/views/Admin.vue';

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
  },
  {
    path: '/restaurant',
    name: 'restaurant',
    component: Restaurant,
    meta: { requireRole: 'user' }
  },
  {
    path: '/reservation',
    name: 'reservation',
    component: Reservation,
    meta: { requireRole: 'user' }
  },
  {
    path: '/safety-insight',
    name: 'safety-insight',
    component: SafetyInsight,
    meta: { requireRole: 'user' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requireRole: 'admin' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = useAuthStore().user;

  if (!to.meta?.requireRole) {  // do need login
    next();
  } else if (!user) {  // not login
    next({ name: 'login' });
  } else if ((user.role ?? 'user') === to.meta.requireRole || user.role === 'admin') {  // admin or meet the require role
    next();
  } else {
    next({ name: 'home' });  // not meet the require role
  }
});

export default router;
