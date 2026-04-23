<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/session';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const error = ref<string | null>(null);

onMounted(async () => {
  const errorQuery = route.query.error;
  if (typeof errorQuery === 'string' && errorQuery.length > 0) {
    error.value = errorQuery;
    return;
  }

  try {
    await sessionStore.fetchSession();
    if (sessionStore.authenticated) {
      await router.replace('/dashboard');
      return;
    }

    error.value = 'Authentication did not complete successfully.';
  } catch (callbackError) {
    error.value = callbackError instanceof Error ? callbackError.message : 'Authentication failed.';
  }
});
</script>

<template>
  <main class="center-state">
    <div class="status-card">
      <h1>{{ error ? 'Sign-in failed' : 'Finishing sign-in...' }}</h1>
      <p v-if="error">{{ error }}</p>
      <p v-else>We’re verifying your GitHub session and loading the dashboard.</p>
      <RouterLink class="ghost-button" to="/login">Back to login</RouterLink>
    </div>
  </main>
</template>
