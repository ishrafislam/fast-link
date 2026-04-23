<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import RepoFilters from '@/components/RepoFilters.vue';
import RepoGroup from '@/components/RepoGroup.vue';
import SummaryStats from '@/components/SummaryStats.vue';
import { useRepoStore } from '@/stores/repos';
import { useSessionStore } from '@/stores/session';
import type { RepoFilters as RepoFilterState } from '@/lib/filters';

const router = useRouter();
const sessionStore = useSessionStore();
const repoStore = useRepoStore();

const ownerEntries = computed(() => Object.entries(repoStore.groupedRepositories));

onMounted(async () => {
  await sessionStore.fetchSession();

  if (!sessionStore.authenticated) {
    await router.replace('/login');
    return;
  }

  await repoStore.fetchRepositories();
});

async function handleLogout() {
  await sessionStore.logout();
  await router.replace('/login');
}

function updateFilter(key: keyof RepoFilterState, value: string) {
  repoStore.updateFilter(key, value as RepoFilterState[typeof key]);
}
</script>

<template>
  <main class="page-shell">
    <AppHeader :user="sessionStore.user" @logout="handleLogout" />

    <div v-if="repoStore.error" class="status-card danger">
      <h2>We couldn’t load your repositories</h2>
      <p>{{ repoStore.error }}</p>
    </div>

    <template v-else-if="repoStore.loading || sessionStore.loading">
      <section class="loading-grid">
        <div v-for="item in 6" :key="item" class="loading-card"></div>
      </section>
    </template>

    <template v-else>
      <SummaryStats v-bind="repoStore.summary" />

      <RepoFilters
        :filters="repoStore.filters"
        :owners="repoStore.owners"
        :languages="repoStore.languages"
        :topics="repoStore.topics"
        @update="updateFilter"
        @reset="repoStore.resetFilters"
      />

      <section v-if="repoStore.filteredRepositories.length === 0" class="status-card">
        <h2>No repositories match these filters</h2>
        <p>Try widening the search or resetting filters to see everything again.</p>
      </section>

      <template v-else>
        <RepoGroup
          v-for="[owner, repositories] in ownerEntries"
          :key="owner"
          :title="owner"
          :repositories="repositories"
        />
      </template>
    </template>
  </main>
</template>
