import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { OrgPayload, RepoPayload, RepositorySummary } from '@shared/github';
import {
  buildLanguageStats,
  defaultFilters,
  filterRepositories,
  groupRepositoriesByOwner,
  type RepoFilters,
} from '@/lib/filters';
import { apiFetch } from '@/lib/api';

export const useRepoStore = defineStore('repos', () => {
  const repositories = ref<RepositorySummary[]>([]);
  const organizations = ref<OrgPayload['organizations']>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const fetchedAt = ref<string | null>(null);
  const filters = ref<RepoFilters>({ ...defaultFilters });

  const filteredRepositories = computed(() => filterRepositories(repositories.value, filters.value));
  const groupedRepositories = computed(() => groupRepositoriesByOwner(filteredRepositories.value));

  const owners = computed(() =>
    Array.from(new Set(repositories.value.map((repository) => repository.owner))).sort(),
  );

  const languages = computed(() =>
    Array.from(new Set(repositories.value.map((repository) => repository.language ?? 'Unknown'))).sort(),
  );

  const topics = computed(() =>
    Array.from(new Set(repositories.value.flatMap((repository) => repository.topics))).sort(),
  );

  const summary = computed(() => {
    const repoSet = filteredRepositories.value;
    const publicCount = repoSet.filter((repository) => !repository.private).length;
    const privateCount = repoSet.length - publicCount;
    const personalCount = repoSet.filter((repository) => repository.ownerType === 'User').length;
    const organizationCount = repoSet.length - personalCount;

    return {
      total: repoSet.length,
      publicCount,
      privateCount,
      personalCount,
      organizationCount,
      topLanguages: buildLanguageStats(repoSet),
    };
  });

  async function fetchRepositories() {
    loading.value = true;
    error.value = null;

    try {
      const [repoPayload, orgPayload] = await Promise.all([
        apiFetch<RepoPayload>('/api/repos'),
        apiFetch<OrgPayload>('/api/orgs'),
      ]);

      repositories.value = repoPayload.repositories;
      organizations.value = orgPayload.organizations;
      fetchedAt.value = repoPayload.fetchedAt;
    } catch (fetchError) {
      error.value = fetchError instanceof Error ? fetchError.message : 'Failed to load repositories';
    } finally {
      loading.value = false;
    }
  }

  function updateFilter<K extends keyof RepoFilters>(key: K, value: RepoFilters[K]) {
    filters.value = {
      ...filters.value,
      [key]: value,
    };
  }

  function resetFilters() {
    filters.value = { ...defaultFilters };
  }

  return {
    repositories,
    organizations,
    loading,
    error,
    fetchedAt,
    filters,
    filteredRepositories,
    groupedRepositories,
    owners,
    languages,
    topics,
    summary,
    fetchRepositories,
    updateFilter,
    resetFilters,
  };
});
