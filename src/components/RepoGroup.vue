<script setup lang="ts">
import RepoCard from '@/components/RepoCard.vue';
import type { RepositorySummary } from '@shared/github';

defineProps<{
  title: string;
  repositories: RepositorySummary[];
}>();
</script>

<template>
  <section class="repo-group">
    <div class="repo-group-head">
      <h3>{{ title }}</h3>
      <span>{{ repositories.length }} repos</span>
    </div>
    <div class="repo-grid">
      <RepoCard v-for="repository in repositories" :key="repository.id" :repository="repository" />
    </div>
  </section>
</template>
