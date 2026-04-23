const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 2;
async function fetchGitHub(path, token) {
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
    return response.json();
}
async function fetchPaginated(path, token) {
    const pageSize = 100;
    let page = 1;
    const allItems = [];
    while (true) {
        const items = await fetchGitHub(`${path}${path.includes('?') ? '&' : '?'}per_page=${pageSize}&page=${page}`, token);
        allItems.push(...items);
        if (items.length < pageSize) {
            break;
        }
        page += 1;
    }
    return allItems;
}
export function normalizeRepository(repository) {
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
export async function fetchViewer(token) {
    const viewer = await fetchGitHub('/user', token);
    return {
        id: viewer.id,
        login: viewer.login,
        name: viewer.name,
        avatarUrl: viewer.avatar_url,
        htmlUrl: viewer.html_url,
    };
}
export async function fetchOrganizations(token) {
    const organizations = await getCached(`orgs:${token}`, async () => fetchPaginated('/user/orgs', token));
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
export async function fetchRepositories(token) {
    const repositories = await getCached(`repos:${token}`, async () => fetchPaginated('/user/repos?affiliation=owner,organization_member,collaborator&sort=updated', token));
    const deduped = Array.from(repositories.reduce((map, repository) => {
        map.set(repository.id, normalizeRepository(repository));
        return map;
    }, new Map()).values());
    return deduped.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}
async function getCached(key, loader) {
    const current = cache.get(key);
    if (current && current.expiresAt > Date.now()) {
        return current.data;
    }
    const data = await loader();
    cache.set(key, {
        data,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return data;
}
