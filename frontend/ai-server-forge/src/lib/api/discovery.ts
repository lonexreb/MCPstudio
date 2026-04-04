import { api } from './client';

export interface DiscoveredServer {
  source: 'npm' | 'github';
  package_name: string;
  display_name: string;
  description: string;
  author: string;
  version: string;
  stars: number;
  tags: string[];
  homepage_url: string;
  install_command: string;
}

export interface DiscoverySearchResponse {
  servers: DiscoveredServer[];
  total: number;
  page: number;
  pages: number;
}

export const discoveryApi = {
  search: (params?: { query?: string; source?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.query) query.set('query', params.query);
    if (params?.source && params.source !== 'all') query.set('source', params.source);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return api.get<DiscoverySearchResponse>(`/api/discovery/search${qs ? `?${qs}` : ''}`);
  },

  categories: () =>
    api.get<{ categories: string[] }>('/api/discovery/categories'),
};
