<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useRepoStore } from '@/stores/repos';
import { useSessionStore } from '@/stores/session';
import { formatRelativeDate } from '@/lib/date';

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const repoStore = useRepoStore();

const repository = computed(() =>
  repoStore.repositories.find(
    (item) => item.owner === route.params.owner && item.name === route.params.name,
  ),
);

onMounted(async () => {
  await sessionStore.fetchSession();
  if (!sessionStore.authenticated) {
    await router.replace('/login');
    return;
  }

  if (repoStore.repositories.length === 0) {
    await repoStore.fetchRepositories();
  }
});
</script>

<template>
  <main class="page-shell">
    <RouterLink class="ghost-button" to="/dashboard">Back to dashboard</RouterLink>

    <section v-if="repository" class="detail-card">
      <div class="detail-head">
        <div>
          <p class="eyebrow">{{ repository.owner }}</p>
          <h1>{{ repository.name }}</h1>
        </div>
        <span class="repo-badge">{{ repository.visibility }}</span>
      </div>

      <p class="detail-description">{{ repository.description || 'No description provided.' }}</p>

      <div class="detail-grid">
        <div>
          <span>Language</span>
          <strong>{{ repository.language || 'Unknown' }}</strong>
        </div>
        <div>
          <span>Stars</span>
          <strong>{{ repository.stargazersCount }}</strong>
        </div>
        <div>
          <span>Forks</span>
          <strong>{{ repository.forksCount }}</strong>
        </div>
        <div>
          <span>Open issues</span>
          <strong>{{ repository.openIssuesCount }}</strong>
        </div>
        <div>
          <span>Default branch</span>
          <strong>{{ repository.defaultBranch || 'Unknown' }}</strong>
        </div>
        <div>
          <span>Updated</span>
          <strong>{{ formatRelativeDate(repository.updatedAt) }}</strong>
        </div>
      </div>

      <div class="repo-tags">
        <span v-if="repository.archived" class="repo-flag warning">Archived</span>
        <span v-if="repository.fork" class="repo-flag">Fork</span>
        <span v-for="topic in repository.topics" :key="topic" class="topic-pill">#{{ topic }}</span>
      </div>

      <a class="primary-button" :href="repository.htmlUrl" target="_blank" rel="noreferrer">
        Open repository on GitHub
      </a>
    </section>

    <section v-else class="status-card">
      <h1>Repository not found</h1>
      <p>The selected repository is not in the current dataset, or the session expired.</p>
    </section>
  </main>
</template>
