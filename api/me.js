import { fetchViewer } from './_lib/github';
import { error, json } from './_lib/http';
import { readTokenFromRequest } from './_lib/session';
export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return error(response, 405, 'Method not allowed');
    }
    const token = readTokenFromRequest(request);
    if (!token) {
        return error(response, 401, 'Not authenticated');
    }
    try {
        const user = await fetchViewer(token);
        return json(response, 200, {
            authenticated: true,
            user,
        });
    }
    catch {
        return error(response, 401, 'Session expired');
    }
}
