import type { VercelResponse } from '@vercel/node';
export declare function json(response: VercelResponse, status: number, body: unknown): void;
export declare function error(response: VercelResponse, status: number, message: string): void;
