export type OwnerType = 'User' | 'Organization';
export type RepositoryVisibility = 'public' | 'private' | 'internal';
export interface RepositorySummary {
    id: number;
    name: string;
    fullName: string;
    owner: string;
    ownerType: OwnerType;
    htmlUrl: string;
    description: string | null;
    visibility: RepositoryVisibility;
    private: boolean;
    archived: boolean;
    fork: boolean;
    language: string | null;
    topics: string[];
    stargazersCount: number;
    forksCount: number;
    openIssuesCount: number;
    defaultBranch: string | null;
    updatedAt: string;
    pushedAt: string | null;
}
export interface OrganizationSummary {
    id: number;
    login: string;
    avatarUrl: string;
    description: string | null;
    reposUrl: string;
}
export interface SessionUser {
    id: number;
    login: string;
    name: string | null;
    avatarUrl: string;
    htmlUrl: string;
}
export interface SessionResponse {
    authenticated: boolean;
    user: SessionUser | null;
}
export interface RepoPayload {
    repositories: RepositorySummary[];
    fetchedAt: string;
}
export interface OrgPayload {
    organizations: OrganizationSummary[];
}
