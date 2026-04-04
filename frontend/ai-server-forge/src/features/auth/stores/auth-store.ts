import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useServerStore } from '@/features/servers/stores/server-store';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),
      logout: () => {
        supabase.auth.signOut();
        set({ token: null, user: null, isAuthenticated: false });
        useServerStore.getState().reset();
      },
      setToken: (token) =>
        set({ token, isAuthenticated: true }),
    }),
    { name: 'mcp-auth' }
  )
);
