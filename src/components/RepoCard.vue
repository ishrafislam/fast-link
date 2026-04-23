<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { RepositorySummary } from '@shared/github';
import { formatRelativeDate } from '@/lib/date';

defineProps<{
  repository: RepositorySummary;
}>();
</script>

<template>
  <article class="repo-card">
    <div class="repo-card-top">
      <div>
        <p class="repo-owner">{{ repository.owner }}</p>
        <RouterLink
          class="repo-title"
          :to="{ name: 'repo-detail', params: { owner: repository.owner, name: repository.name } }"
        >
          {{ repository.name }}
        </RouterLink>
      </div>
      <span class="repo-badge">{{ repository.visibility }}</span>
    </div>

    <p class="repo-description">
      {{ repository.description || 'No description provided.' }}
    </p>

    <div class="repo-meta">
      <span>{{ repository.language || 'Unknown' }}</span>
      <span>{{ repository.stargazersCount }} stars</span>
      <span>{{ repository.forksCount }} forks</span>
      <span>Updated {{ formatRelativeDate(repository.updatedAt) }}</span>
    </div>

    <div class="repo-tags">
      <span v-if="repository.archived" class="repo-flag warning">Archived</span>
      <span v-if="repository.fork" class="repo-flag">Fork</span>
      <span v-for="topic in repository.topics.slice(0, 4)" :key="topic" class="topic-pill">#{{ topic }}</span>
    </div>

    <a class="primary-link" :href="repository.htmlUrl" target="_blank" rel="noreferrer">
      Open on GitHub
    </a>
  </article>
</template>
