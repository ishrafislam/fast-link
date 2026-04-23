import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearSession } from '../_lib/session.js';
import { error } from '../_lib/http.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return error(response, 405, 'Method not allowed');
  }

  clearSession(response);
  response.status(200).json({ success: true });
}
