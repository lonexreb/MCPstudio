import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useSettingsStore } from '@/features/settings/stores/settings-store';

function getBaseUrl() {
  return useSettingsStore.getState().apiBaseUrl;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

function isRetryable(status: number): boolean {
  return status >= 500 || status === 408 || status === 429;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${getBaseUrl()}${path}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        useAuthStore.getState().logout();
        throw new ApiError(401, 'Unauthorized');
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const error = new ApiError(
          response.status,
          data?.detail || `Request failed with status ${response.status}`,
          data,
        );

        if (isRetryable(response.status) && attempt < MAX_RETRIES) {
          lastError = error;
          await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
          continue;
        }

        throw error;
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (err) {
      if (err instanceof ApiError) throw err;

      // Network error — retry if attempts remain
      lastError = err as Error;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};

export { ApiError };
