export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

interface RequestLike {
  url?: string;
  headers?: {
    host?: string;
    'x-forwarded-proto'?: string;
  };
}

export function getBaseUrl(request?: RequestLike) {
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL;
  }

  const host = request?.headers?.host;
  const protocol = request?.headers?.['x-forwarded-proto'] || 'http';

  if (host) {
    return `${protocol}://${host}`;
  }

  if (request?.url?.startsWith('http')) {
    return new URL(request.url).origin;
  }

  return 'http://localhost:5173';
}
