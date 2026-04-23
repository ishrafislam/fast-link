import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBaseUrl, getRequiredEnv } from '../../_lib/env.js';
import { error } from '../../_lib/http.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    return error(response, 405, 'Method not allowed');
  }

  try {
    const clientId = getRequiredEnv('GITHUB_CLIENT_ID');
    const redirectUri = `${getBaseUrl(request)}/api/auth/github/callback`;
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'read:user repo read:org');

    response.redirect(authUrl.toString());
  } catch (handlerError) {
    return error(
      response,
      500,
      handlerError instanceof Error ? handlerError.message : 'Unable to start GitHub login',
    );
  }
}
