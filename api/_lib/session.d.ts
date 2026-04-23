import type { VercelRequest, VercelResponse } from '@vercel/node';
export declare function createSessionCookie(token: string): string;
export declare function clearSessionCookie(): string;
export declare function readTokenFromRequest(request: VercelRequest): string | null;
export declare function sendSession(response: VercelResponse, token: string): void;
export declare function clearSession(response: VercelResponse): void;
