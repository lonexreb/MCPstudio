import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serversApi } from '@/lib/api/servers';
import type { ServerCreate, ServerUpdate } from '@/types/api';

export function useServers() {
  return useQuery({
    queryKey: ['servers'],
    queryFn: () => serversApi.list(),
    select: (data) => data.servers,
  });
}

export function useServer(id: string | undefined) {
  return useQuery({
    queryKey: ['servers', id],
    queryFn: () => serversApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServerCreate) => serversApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
  });
}

export function useUpdateServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServerUpdate }) =>
      serversApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.invalidateQueries({ queryKey: ['servers', variables.id] });
    },
  });
}

export function useDeleteServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serversApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
  });
}

export function useConnectServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serversApi.connect(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.invalidateQueries({ queryKey: ['servers', id] });
    },
  });
}

export function useDisconnectServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serversApi.disconnect(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.invalidateQueries({ queryKey: ['servers', id] });
    },
  });
}
