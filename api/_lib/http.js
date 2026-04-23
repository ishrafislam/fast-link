export function json(response, status, body) {
    response.status(status).json(body);
}
export function error(response, status, message) {
    response.status(status).send(message);
}
