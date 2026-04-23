import type { VercelResponse } from '@vercel/node';

export function json(response: VercelResponse, status: number, body: unknown) {
  response.status(status).json(body);
}

export function error(response: VercelResponse, status: number, message: string) {
  response.status(status).send(message);
}
