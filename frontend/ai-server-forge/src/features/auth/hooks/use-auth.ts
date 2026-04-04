import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/auth/stores/auth-store';

export function useRegister() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password, username }: { email: string; password: string; username: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) throw new Error(error.message);
      if (!data.session) throw new Error('Account created! Please check your email to confirm, then sign in.');
      return {
        token: data.session.access_token,
        user: {
          id: data.user!.id,
          username: data.user!.user_metadata?.username || username,
          email,
        },
      };
    },
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      return {
        token: data.session!.access_token,
        user: {
          id: data.user!.id,
          username: data.user!.user_metadata?.username || data.user!.email?.split('@')[0] || 'user',
          email: data.user!.email,
        },
      };
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
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return {
        id: data.user.id,
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user',
      };
    },
    enabled: isAuthenticated && !!token,
  });
}
