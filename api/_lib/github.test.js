import { normalizeRepository } from './github';
describe('normalizeRepository', () => {
    it('maps GitHub API fields to the shared summary shape', () => {
        expect(normalizeRepository({
            id: 42,
            name: 'fast-link',
            full_name: 'md/fast-link',
            owner: {
                login: 'md',
                type: 'User',
            },
            html_url: 'https://github.com/md/fast-link',
            description: 'Repo dashboard',
            private: true,
            visibility: 'private',
            archived: false,
            fork: false,
            language: 'TypeScript',
            topics: ['vue', 'vercel'],
            stargazers_count: 8,
            forks_count: 2,
            open_issues_count: 3,
            default_branch: 'main',
            updated_at: '2026-04-22T00:00:00Z',
            pushed_at: '2026-04-22T00:00:00Z',
        })).toEqual({
            id: 42,
            name: 'fast-link',
            fullName: 'md/fast-link',
            owner: 'md',
            ownerType: 'User',
            htmlUrl: 'https://github.com/md/fast-link',
            description: 'Repo dashboard',
            visibility: 'private',
            private: true,
            archived: false,
            fork: false,
            language: 'TypeScript',
            topics: ['vue', 'vercel'],
            stargazersCount: 8,
            forksCount: 2,
            openIssuesCount: 3,
            defaultBranch: 'main',
            updatedAt: '2026-04-22T00:00:00Z',
            pushedAt: '2026-04-22T00:00:00Z',
        });
    });
});
