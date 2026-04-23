import { getBaseUrl, getRequiredEnv } from '../../_lib/env';
import { error } from '../../_lib/http';
import { sendSession } from '../../_lib/session';
export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return error(response, 405, 'Method not allowed');
    }
    const code = request.query.code;
    if (typeof code !== 'string') {
        return error(response, 400, 'Missing OAuth code');
    }
    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: getRequiredEnv('GITHUB_CLIENT_ID'),
                client_secret: getRequiredEnv('GITHUB_CLIENT_SECRET'),
                code,
                redirect_uri: `${getBaseUrl(request)}/api/auth/github/callback`,
            }),
        });
        const payload = (await tokenResponse.json());
        if (!tokenResponse.ok || !payload.access_token) {
            throw new Error(payload.error_description || 'GitHub token exchange failed');
        }
        sendSession(response, payload.access_token);
        response.redirect(`${getBaseUrl(request)}/auth/callback`);
    }
    catch (handlerError) {
        response.redirect(`${getBaseUrl(request)}/auth/callback?error=${encodeURIComponent(handlerError instanceof Error ? handlerError.message : 'Authentication failed')}`);
    }
}
