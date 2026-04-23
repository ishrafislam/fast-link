import { defineStore } from 'pinia';
import type { SessionResponse } from '@shared/github';
import { ApiError, apiFetch } from '@/lib/api';

interface SessionState {
  loading: boolean;
  authenticated: boolean;
  user: SessionResponse['user'];
  error: string | null;
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    loading: false,
    authenticated: false,
    user: null,
    error: null,
  }),
  actions: {
    async loginWithToken(token: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiFetch<SessionResponse>('/api/auth/token', {
          method: 'POST',
          body: JSON.stringify({
            token,
          }),
        });

        this.authenticated = response.authenticated;
        this.user = response.user;
      } catch (error) {
        this.authenticated = false;
        this.user = null;
        this.error = error instanceof Error ? error.message : 'Unable to sign in';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchSession() {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiFetch<SessionResponse>('/api/me');
        this.authenticated = response.authenticated;
        this.user = response.user;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          this.authenticated = false;
          this.user = null;
          return;
        }

        this.error = error instanceof Error ? error.message : 'Unable to fetch session';
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.loading = true;
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } finally {
        this.authenticated = false;
        this.user = null;
        this.loading = false;
      }
    },
  },
});
