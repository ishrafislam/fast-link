<script setup lang="ts">
import type { RepoFilters } from '@/lib/filters';

defineProps<{
  filters: RepoFilters;
  owners: string[];
  languages: string[];
  topics: string[];
}>();

const emit = defineEmits<{
  update: [key: keyof RepoFilters, value: string];
  reset: [];
}>();
</script>

<template>
  <section class="filters-panel">
    <div class="filters-head">
      <div>
        <p class="eyebrow">Filters</p>
        <h2>Refine your repository list</h2>
      </div>
      <button class="ghost-button" type="button" @click="emit('reset')">Reset</button>
    </div>

    <div class="filters-grid">
      <label>
        Search
        <input
          :value="filters.search"
          type="search"
          placeholder="Search name or description"
          @input="emit('update', 'search', ($event.target as HTMLInputElement).value)"
        />
      </label>

      <label>
        Owner
        <select :value="filters.owner" @change="emit('update', 'owner', ($event.target as HTMLSelectElement).value)">
          <option value="all">All owners</option>
          <option v-for="owner in owners" :key="owner" :value="owner">{{ owner }}</option>
        </select>
      </label>

      <label>
        Visibility
        <select
          :value="filters.visibility"
          @change="emit('update', 'visibility', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="internal">Internal</option>
        </select>
      </label>

      <label>
        Language
        <select
          :value="filters.language"
          @change="emit('update', 'language', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">All languages</option>
          <option v-for="language in languages" :key="language" :value="language">{{ language }}</option>
        </select>
      </label>

      <label>
        Status
        <select
          :value="filters.archived"
          @change="emit('update', 'archived', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">All repos</option>
          <option value="active">Active only</option>
          <option value="archived">Archived only</option>
        </select>
      </label>

      <label>
        Source
        <select
          :value="filters.source"
          @change="emit('update', 'source', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">All repos</option>
          <option value="source">Source only</option>
          <option value="fork">Forks only</option>
        </select>
      </label>

      <label>
        Topic
        <select :value="filters.topic" @change="emit('update', 'topic', ($event.target as HTMLSelectElement).value)">
          <option value="all">All topics</option>
          <option v-for="topic in topics" :key="topic" :value="topic">{{ topic }}</option>
        </select>
      </label>

      <label>
        Sort
        <select :value="filters.sort" @change="emit('update', 'sort', ($event.target as HTMLSelectElement).value)">
          <option value="updated">Recently updated</option>
          <option value="stars">Most stars</option>
          <option value="forks">Most forks</option>
          <option value="name">Name</option>
        </select>
      </label>
    </div>
  </section>
</template>
