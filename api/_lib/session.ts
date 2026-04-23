import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRequiredEnv } from './env.js';

const COOKIE_NAME = 'fast_link_session';
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getKey() {
  return createHash('sha256').update(getRequiredEnv('SESSION_SECRET')).digest();
}

export function createSessionCookie(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, authTag, encrypted]).toString('base64url');
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';

  return `${COOKIE_NAME}=${payload}; HttpOnly; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

export function clearSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}

export function readTokenFromRequest(request: VercelRequest): string | null {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((part) => {
      const [key, ...value] = part.trim().split('=');
      return [key, value.join('=')];
    }),
  );

  const payload = cookies[COOKIE_NAME];
  if (!payload) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, 'base64url');
    const iv = raw.subarray(0, 12);
    const authTag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', getKey(), iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

export function sendSession(response: VercelResponse, token: string) {
  response.setHeader('Set-Cookie', createSessionCookie(token));
}

export function clearSession(response: VercelResponse) {
  response.setHeader('Set-Cookie', clearSessionCookie());
}
