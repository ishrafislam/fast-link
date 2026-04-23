import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchOrganizations } from './_lib/github';
import { error, json } from './_lib/http';
import { readTokenFromRequest } from './_lib/session';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    return error(response, 405, 'Method not allowed');
  }

  const token = readTokenFromRequest(request);
  if (!token) {
    return error(response, 401, 'Not authenticated');
  }

  try {
    const organizations = await fetchOrganizations(token);
    return json(response, 200, {
      organizations,
    });
  } catch (handlerError) {
    return error(
      response,
      500,
      handlerError instanceof Error ? handlerError.message : 'Unable to load organizations',
    );
  }
}
