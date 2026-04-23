<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/session';

const router = useRouter();
const sessionStore = useSessionStore();
const token = ref('');

const helpText = computed(() =>
  'Use a fine-grained personal access token with access to your profile, the repositories you want listed, and any organization repositories you want included.',
);

async function handleSubmit() {
  if (!token.value.trim()) {
    sessionStore.error = 'Enter a GitHub token to continue.';
    return;
  }

  try {
    await sessionStore.loginWithToken(token.value);
    token.value = '';
    await router.replace('/dashboard');
  } catch {
    token.value = '';
  }
}
</script>

<template>
  <main class="auth-shell">
    <section class="hero-card">
      <p class="eyebrow">Single-user dashboard</p>
      <h1>Paste your GitHub token and browse every repo you can access</h1>
      <p>
        Fast Link pulls your personal and organization repositories into one searchable dashboard using
        a GitHub fine-grained personal access token stored in an encrypted HTTP-only cookie.
      </p>

      <ul class="feature-list">
        <li>Personal + organization repository discovery</li>
        <li>Client-side search, filters, and sorting</li>
        <li>Token stays server-side after sign-in with encrypted cookie-based sessions</li>
      </ul>

      <form class="token-form" @submit.prevent="handleSubmit">
        <label>
          GitHub personal access token
          <input
            v-model="token"
            class="token-input"
            type="password"
            placeholder="github_pat_..."
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        <p class="token-help">{{ helpText }}</p>
        <p v-if="sessionStore.error" class="token-error">{{ sessionStore.error }}</p>

        <button class="primary-button" type="submit" :disabled="sessionStore.loading">
          {{ sessionStore.loading ? 'Signing in...' : 'Sign in with token' }}
        </button>
      </form>
    </section>
  </main>
</template>
