import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ServerStore {
  selectedServerId: string | null;
  setSelectedServer: (id: string | null) => void;
}

export const useServerStore = create<ServerStore>()(
  persist(
    (set) => ({
      selectedServerId: null,
      setSelectedServer: (id) => set({ selectedServerId: id }),
    }),
    { name: 'mcp-server' }
  )
);
