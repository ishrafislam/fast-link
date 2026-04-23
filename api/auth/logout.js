import { clearSession } from '../_lib/session';
import { error } from '../_lib/http';
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return error(response, 405, 'Method not allowed');
    }
    clearSession(response);
    response.status(200).json({ success: true });
}
