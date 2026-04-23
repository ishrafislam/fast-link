import { fetchRepositories } from './_lib/github';
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
        const repositories = await fetchRepositories(token);
        return json(response, 200, {
            repositories,
            fetchedAt: new Date().toISOString(),
        });
    }
    catch (handlerError) {
        return error(response, 500, handlerError instanceof Error ? handlerError.message : 'Unable to load repositories');
    }
}
