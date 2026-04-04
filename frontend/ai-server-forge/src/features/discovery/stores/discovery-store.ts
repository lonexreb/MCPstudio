import { create } from 'zustand';

interface DiscoveryStore {
  searchQuery: string;
  selectedSource: string;
  page: number;
  setSearchQuery: (q: string) => void;
  setSelectedSource: (s: string) => void;
  setPage: (p: number) => void;
}

export const useDiscoveryStore = create<DiscoveryStore>()((set) => ({
  searchQuery: 'mcp server',
  selectedSource: 'all',
  page: 1,
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setSelectedSource: (selectedSource) => set({ selectedSource, page: 1 }),
  setPage: (page) => set({ page }),
}));
