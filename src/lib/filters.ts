import type { RepositorySummary } from '@shared/github';

export type VisibilityFilter = 'all' | 'public' | 'private' | 'internal';
export type ArchiveFilter = 'all' | 'active' | 'archived';
export type SourceFilter = 'all' | 'source' | 'fork';
export type SortOption = 'updated' | 'stars' | 'name' | 'forks';

export interface RepoFilters {
  search: string;
  owner: string;
  visibility: VisibilityFilter;
  language: string;
  archived: ArchiveFilter;
  source: SourceFilter;
  topic: string;
  sort: SortOption;
}

export const defaultFilters: RepoFilters = {
  search: '',
  owner: 'all',
  visibility: 'all',
  language: 'all',
  archived: 'all',
  source: 'all',
  topic: 'all',
  sort: 'updated',
};

export function filterRepositories(
  repositories: RepositorySummary[],
  filters: RepoFilters,
): RepositorySummary[] {
  const search = filters.search.trim().toLowerCase();

  const filtered = repositories.filter((repository) => {
    const matchesSearch =
      search.length === 0 ||
      repository.name.toLowerCase().includes(search) ||
      repository.fullName.toLowerCase().includes(search) ||
      repository.description?.toLowerCase().includes(search);

    const matchesOwner =
      filters.owner === 'all' || repository.owner.toLowerCase() === filters.owner.toLowerCase();

    const matchesVisibility =
      filters.visibility === 'all' || repository.visibility === filters.visibility;

    const matchesLanguage =
      filters.language === 'all' ||
      (repository.language ?? 'Unknown').toLowerCase() === filters.language.toLowerCase();

    const matchesArchived =
      filters.archived === 'all' ||
      (filters.archived === 'archived' ? repository.archived : !repository.archived);

    const matchesSource =
      filters.source === 'all' ||
      (filters.source === 'fork' ? repository.fork : !repository.fork);

    const matchesTopic =
      filters.topic === 'all' ||
      repository.topics.some((topic) => topic.toLowerCase() === filters.topic.toLowerCase());

    return (
      matchesSearch &&
      matchesOwner &&
      matchesVisibility &&
      matchesLanguage &&
      matchesArchived &&
      matchesSource &&
      matchesTopic
    );
  });

  return filtered.sort((left, right) => sortRepositories(left, right, filters.sort));
}

function sortRepositories(
  left: RepositorySummary,
  right: RepositorySummary,
  sort: SortOption,
): number {
  switch (sort) {
    case 'stars':
      return right.stargazersCount - left.stargazersCount || compareByName(left, right);
    case 'forks':
      return right.forksCount - left.forksCount || compareByName(left, right);
    case 'name':
      return compareByName(left, right);
    case 'updated':
    default:
      return (
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime() ||
        compareByName(left, right)
      );
  }
}

function compareByName(left: RepositorySummary, right: RepositorySummary): number {
  return left.fullName.localeCompare(right.fullName);
}

export function groupRepositoriesByOwner(repositories: RepositorySummary[]) {
  return repositories.reduce<Record<string, RepositorySummary[]>>((groups, repository) => {
    const key = repository.owner;
    groups[key] ??= [];
    groups[key].push(repository);
    return groups;
  }, {});
}

export function buildLanguageStats(repositories: RepositorySummary[]) {
  const counts = repositories.reduce<Record<string, number>>((accumulator, repository) => {
    const key = repository.language ?? 'Unknown';
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 5);
}
