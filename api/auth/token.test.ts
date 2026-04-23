import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from './token';

const { fetchViewerMock } = vi.hoisted(() => ({
  fetchViewerMock: vi.fn(),
}));

vi.mock('../_lib/github.js', () => ({
  fetchViewer: fetchViewerMock,
}));

describe('POST /api/auth/token', () => {
  beforeEach(() => {
    fetchViewerMock.mockReset();
    process.env.SESSION_SECRET = 'test-session-secret';
  });

  it('creates a session cookie for a valid token', async () => {
    fetchViewerMock.mockResolvedValue({
      id: 1,
      login: 'md',
      name: 'MD',
      avatarUrl: 'https://example.com/avatar.png',
      htmlUrl: 'https://github.com/md',
    });

    const { request, response, headers, jsonBody } = createMocks({
      method: 'POST',
      body: {
        token: 'github_pat_valid',
      },
    });

    await handler(request, response);

    expect(fetchViewerMock).toHaveBeenCalledWith('github_pat_valid');
    expect(headers['Set-Cookie']).toContain('fast_link_session=');
    expect(headers['Set-Cookie']).not.toContain('Max-Age=');
    expect(jsonBody.value).toEqual({
      authenticated: true,
      user: {
        id: 1,
        login: 'md',
        name: 'MD',
        avatarUrl: 'https://example.com/avatar.png',
        htmlUrl: 'https://github.com/md',
      },
    });
  });

  it('returns 401 for an invalid token', async () => {
    fetchViewerMock.mockRejectedValue(new Error('bad token'));

    const { request, response, statusCode, sentBody } = createMocks({
      method: 'POST',
      body: {
        token: 'invalid',
      },
    });

    await handler(request, response);

    expect(statusCode.value).toBe(401);
    expect(sentBody.value).toBe('Invalid GitHub token');
  });
});

function createMocks({
  method,
  body,
}: {
  method: string;
  body?: unknown;
}) {
  const headers: Record<string, string> = {};
  const statusCode = {
    value: 200,
  };
  const sentBody = {
    value: '',
  };
  const jsonBody = {
    value: undefined as unknown,
  };

  const request = {
    method,
    body,
    headers: {},
  } as unknown as VercelRequest;

  const response = {
    setHeader(name: string, value: string) {
      headers[name] = value;
      return response;
    },
    status(code: number) {
      statusCode.value = code;
      return response;
    },
    send(body: string) {
      sentBody.value = body;
      return response;
    },
    json(body: unknown) {
      jsonBody.value = body;
      return response;
    },
  } as unknown as VercelResponse;

  return {
    request,
    response,
    headers,
    statusCode,
    sentBody,
    jsonBody,
  };
}
