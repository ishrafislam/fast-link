export declare function getRequiredEnv(name: string): string;
interface RequestLike {
    url?: string;
    headers?: {
        host?: string;
        'x-forwarded-proto'?: string;
    };
}
export declare function getBaseUrl(request?: RequestLike): string;
export {};
