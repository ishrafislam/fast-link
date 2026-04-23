<script setup lang="ts">
import type { SessionUser } from '@shared/github';

defineProps<{
  user: SessionUser | null;
}>();

const emit = defineEmits<{
  logout: [];
}>();
</script>

<template>
  <header class="app-header">
    <div>
      <p class="eyebrow">Fast Link</p>
      <h1>GitHub Repository Dashboard</h1>
      <p class="header-copy">
        Search, filter, and browse every repository you can access across your personal account and organizations.
      </p>
    </div>

    <div v-if="user" class="user-chip">
      <img :src="user.avatarUrl" :alt="user.login" class="avatar" />
      <div>
        <strong>{{ user.name || user.login }}</strong>
        <p>{{ user.login }}</p>
      </div>
      <button class="ghost-button" type="button" @click="emit('logout')">Logout</button>
    </div>
  </header>
</template>
