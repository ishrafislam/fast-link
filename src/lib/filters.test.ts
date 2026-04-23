import { buildLanguageStats, defaultFilters, filterRepositories } from '@/lib/filters';
import type { RepositorySummary } from '@shared/github';

const repositories: RepositorySummary[] = [
  {
    id: 1,
    name: 'alpha',
    fullName: 'me/alpha',
    owner: 'me',
    ownerType: 'User',
    htmlUrl: 'https://github.com/me/alpha',
    description: 'Vue dashboard',
    visibility: 'private',
    private: true,
    archived: false,
    fork: false,
    language: 'TypeScript',
    topics: ['vue', 'dashboard'],
    stargazersCount: 10,
    forksCount: 2,
    openIssuesCount: 1,
    defaultBranch: 'main',
    updatedAt: '2026-04-22T00:00:00Z',
    pushedAt: '2026-04-22T00:00:00Z',
  },
  {
    id: 2,
    name: 'beta',
    fullName: 'org/beta',
    owner: 'org',
    ownerType: 'Organization',
    htmlUrl: 'https://github.com/org/beta',
    description: 'Forked utility',
    visibility: 'public',
    private: false,
    archived: false,
    fork: true,
    language: 'Go',
    topics: ['utility'],
    stargazersCount: 4,
    forksCount: 9,
    openIssuesCount: 0,
    defaultBranch: 'main',
    updatedAt: '2026-04-20T00:00:00Z',
    pushedAt: '2026-04-20T00:00:00Z',
  },
  {
    id: 3,
    name: 'gamma',
    fullName: 'org/gamma',
    owner: 'org',
    ownerType: 'Organization',
    htmlUrl: 'https://github.com/org/gamma',
    description: 'Archived repo',
    visibility: 'public',
    private: false,
    archived: true,
    fork: false,
    language: null,
    topics: ['archive'],
    stargazersCount: 1,
    forksCount: 0,
    openIssuesCount: 0,
    defaultBranch: 'main',
    updatedAt: '2026-03-01T00:00:00Z',
    pushedAt: '2026-03-01T00:00:00Z',
  },
];

describe('filterRepositories', () => {
  it('filters by search, owner, and visibility together', () => {
    const results = filterRepositories(repositories, {
      ...defaultFilters,
      search: 'vue',
      owner: 'me',
      visibility: 'private',
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('alpha');
  });

  it('filters archived and fork states independently', () => {
    const archivedResults = filterRepositories(repositories, {
      ...defaultFilters,
      archived: 'archived',
    });
    const forkResults = filterRepositories(repositories, {
      ...defaultFilters,
      source: 'fork',
    });

    expect(archivedResults.map((repository) => repository.name)).toEqual(['gamma']);
    expect(forkResults.map((repository) => repository.name)).toEqual(['beta']);
  });

  it('sorts by stars descending', () => {
    const results = filterRepositories(repositories, {
      ...defaultFilters,
      sort: 'stars',
    });

    expect(results.map((repository) => repository.name)).toEqual(['alpha', 'beta', 'gamma']);
  });
});

describe('buildLanguageStats', () => {
  it('counts top languages including unknown', () => {
    expect(buildLanguageStats(repositories)).toEqual([
      ['Go', 1],
      ['TypeScript', 1],
      ['Unknown', 1],
    ]);
  });
});
