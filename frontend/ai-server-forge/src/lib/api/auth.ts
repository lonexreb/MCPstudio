import type { TokenResponse, UserResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8005';

export const authApi = {
  /** Register a new user */
  register: async (username: string, password: string): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.detail || 'Registration failed');
    }

    return response.json();
  },

  /** Login uses form-encoded body (OAuth2 password flow) */
  login: async (username: string, password: string): Promise<TokenResponse> => {
    const body = new URLSearchParams({ username, password });

    const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.detail || 'Login failed');
    }

    return response.json();
  },

  getCurrentUser: async (token: string): Promise<UserResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return response.json();
  },

  getGoogleAuthUrl: async (serverId?: string): Promise<{ auth_url: string; state: string }> => {
    const params = serverId ? `?server_id=${encodeURIComponent(serverId)}` : '';
    const response = await fetch(`${API_BASE_URL}/api/auth/google/auth${params}`);

    if (!response.ok) {
      throw new Error('Failed to get Google auth URL');
    }

    return response.json();
  },
};
