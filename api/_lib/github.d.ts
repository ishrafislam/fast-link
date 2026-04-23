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
export declare function normalizeRepository(repository: GitHubRepository): RepositorySummary;
export declare function fetchViewer(token: string): Promise<SessionUser>;
export declare function fetchOrganizations(token: string): Promise<OrganizationSummary[]>;
export declare function fetchRepositories(token: string): Promise<RepositorySummary[]>;
export {};
