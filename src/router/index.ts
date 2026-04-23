import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import AuthCallbackView from '@/views/AuthCallbackView.vue';
import DashboardView from '@/views/DashboardView.vue';
import RepoDetailView from '@/views/RepoDetailView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/repo/:owner/:name',
      name: 'repo-detail',
      component: RepoDetailView,
      props: true,
    },
  ],
});

export default router;
