import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/features/auth/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Logged in successfully');
        navigate('/');
      },
      onError: (error) => {
        toast.error(error.message || 'Invalid credentials');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, hsl(250, 30%, 8%) 0%, hsl(230, 20%, 10%) 50%, hsl(220, 25%, 8%) 100%)' }}
    >
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15 blur-[100px] bg-mcp-purple-600 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-[100px] bg-mcp-blue-600 pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-10 blur-[80px] bg-mcp-teal-600 pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Gradient border wrapper */}
        <div className="absolute -inset-[1px] rounded-2xl gradient-brand opacity-30 blur-[1px]" />
        <Card className="relative border-0 shadow-2xl shadow-purple-500/10 rounded-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto w-14 h-14 rounded-xl gradient-brand flex items-center justify-center shadow-lg glow-purple animate-float">
              <Package className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gradient-brand">MCPStudio</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Sign in to manage your MCP servers
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-background/50 border-border/50 focus:border-mcp-purple-500/50 focus:ring-mcp-purple-500/20 transition-colors"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-background/50 border-border/50 focus:border-mcp-purple-500/50 focus:ring-mcp-purple-500/20 transition-colors"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full h-11 gradient-brand hover:gradient-brand-hover text-white font-semibold shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all border-0"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <Link to="/signup" className="text-mcp-purple-400 hover:text-mcp-purple-300 hover:underline font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
