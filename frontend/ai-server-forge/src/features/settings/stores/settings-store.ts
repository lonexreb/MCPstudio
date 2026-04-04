import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

interface SettingsStore {
  theme: Theme;
  apiBaseUrl: string;
  setTheme: (theme: Theme) => void;
  setApiBaseUrl: (url: string) => void;
  reset: () => void;
}

const defaults = {
  theme: 'dark' as Theme,
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8005',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      setTheme: (theme) => {
        document.documentElement.classList.toggle('light', theme === 'light');
        set({ theme });
      },
      setApiBaseUrl: (apiBaseUrl) => set({ apiBaseUrl }),
      reset: () => {
        document.documentElement.classList.remove('light');
        set(defaults);
      },
    }),
    { name: 'mcp-settings' }
  )
);

// Apply persisted theme on load
const { theme } = useSettingsStore.getState();
if (theme === 'light') {
  document.documentElement.classList.add('light');
}
