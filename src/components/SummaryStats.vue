<script setup lang="ts">
defineProps<{
  total: number;
  publicCount: number;
  privateCount: number;
  personalCount: number;
  organizationCount: number;
  topLanguages: [string, number][];
}>();
</script>

<template>
  <section class="summary-grid">
    <article class="summary-card">
      <span>Total repos</span>
      <strong>{{ total }}</strong>
    </article>
    <article class="summary-card">
      <span>Public vs private</span>
      <strong>{{ publicCount }} / {{ privateCount }}</strong>
    </article>
    <article class="summary-card">
      <span>Personal vs org</span>
      <strong>{{ personalCount }} / {{ organizationCount }}</strong>
    </article>
    <article class="summary-card summary-languages">
      <span>Top languages</span>
      <ul>
        <li v-for="[language, count] in topLanguages" :key="language">
          {{ language }} <strong>{{ count }}</strong>
        </li>
      </ul>
    </article>
  </section>
</template>
