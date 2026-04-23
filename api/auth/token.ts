import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchViewer } from '../_lib/github.js';
import { error, json } from '../_lib/http.js';
import { sendSession } from '../_lib/session.js';

interface TokenBody {
  token?: string;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return error(response, 405, 'Method not allowed');
  }

  const body = typeof request.body === 'string'
    ? (JSON.parse(request.body) as TokenBody)
    : ((request.body ?? {}) as TokenBody);

  const token = body.token?.trim();
  if (!token) {
    return error(response, 400, 'GitHub token is required');
  }

  try {
    const user = await fetchViewer(token);
    sendSession(response, token);

    return json(response, 200, {
      authenticated: true,
      user,
    });
  } catch {
    return error(response, 401, 'Invalid GitHub token');
  }
}
