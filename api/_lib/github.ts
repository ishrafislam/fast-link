import type { OrganizationSummary, RepositorySummary, SessionUser } from '@shared/github';

interface GitHubOwner {
  login: string;
  type: 'User' | 'Organization';
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubOwner;
  html_url: string;
  description: string | null;
  private: boolean;
  visibility?: 'public' | 'private' | 'internal';
  archived: boolean;
  fork: boolean;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string | null;
  updated_at: string;
  pushed_at: string | null;
}

interface GitHubOrganization {
  id: number;
  login: string;
  avatar_url: string;
  description: string | null;
  repos_url: string;
}

interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 1000 * 60 * 2;

async function fetchGitHub<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'fast-link-dashboard',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API request failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}

async function fetchPaginated<T>(path: string, token: string): Promise<T[]> {
  const pageSize = 100;
  let page = 1;
  const allItems: T[] = [];

  while (true) {
    const items = await fetchGitHub<T[]>(`${path}${path.includes('?') ? '&' : '?'}per_page=${pageSize}&page=${page}`, token);
    allItems.push(...items);
    if (items.length < pageSize) {
      break;
    }
    page += 1;
  }

  return allItems;
}

export function normalizeRepository(repository: GitHubRepository): RepositorySummary {
  return {
    id: repository.id,
    name: repository.name,
    fullName: repository.full_name,
    owner: repository.owner.login,
    ownerType: repository.owner.type,
    htmlUrl: repository.html_url,
    description: repository.description,
    visibility: repository.visibility ?? (repository.private ? 'private' : 'public'),
    private: repository.private,
    archived: repository.archived,
    fork: repository.fork,
    language: repository.language,
    topics: repository.topics ?? [],
    stargazersCount: repository.stargazers_count,
    forksCount: repository.forks_count,
    openIssuesCount: repository.open_issues_count,
    defaultBranch: repository.default_branch,
    updatedAt: repository.updated_at,
    pushedAt: repository.pushed_at,
  };
}

export async function fetchViewer(token: string): Promise<SessionUser> {
  const viewer = await fetchGitHub<{
    id: number;
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
  }>('/user', token);

  return {
    id: viewer.id,
    login: viewer.login,
    name: viewer.name,
    avatarUrl: viewer.avatar_url,
    htmlUrl: viewer.html_url,
  };
}

export async function fetchOrganizations(token: string): Promise<OrganizationSummary[]> {
  const organizations = await getCached(`orgs:${token}`, async () =>
    fetchPaginated<GitHubOrganization>('/user/orgs', token),
  );

  return organizations
    .map((organization) => ({
      id: organization.id,
      login: organization.login,
      avatarUrl: organization.avatar_url,
      description: organization.description,
      reposUrl: organization.repos_url,
    }))
    .sort((left, right) => left.login.localeCompare(right.login));
}

export async function fetchRepositories(token: string): Promise<RepositorySummary[]> {
  const repositories = await getCached(`repos:${token}`, async () =>
    fetchPaginated<GitHubRepository>('/user/repos?affiliation=owner,organization_member,collaborator&sort=updated', token),
  );

  const deduped = Array.from(
    repositories.reduce<Map<number, RepositorySummary>>((map, repository) => {
      map.set(repository.id, normalizeRepository(repository));
      return map;
    }, new Map<number, RepositorySummary>()).values(),
  );

  return deduped.sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

async function getCached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const current = cache.get(key);
  if (current && current.expiresAt > Date.now()) {
    return current.data as T;
  }

  const data = await loader();
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  return data;
}
