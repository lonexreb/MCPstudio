import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const tokenResponse = await authApi.login(username, password);
      const user = await authApi.getCurrentUser(tokenResponse.access_token);
      return { token: tokenResponse.access_token, user };
    },
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}

export function useCurrentUser() {
  const { token, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser', token],
    queryFn: () => authApi.getCurrentUser(token!),
    enabled: isAuthenticated && !!token,
  });
}
