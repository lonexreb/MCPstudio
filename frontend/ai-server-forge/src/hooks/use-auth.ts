import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: async (data) => {
      const user = await authApi.getCurrentUser(data.access_token);
      login(data.access_token, user);
    },
  });
}

export function useCurrentUser() {
  const { token, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(token!),
    enabled: isAuthenticated && !!token,
  });
}
