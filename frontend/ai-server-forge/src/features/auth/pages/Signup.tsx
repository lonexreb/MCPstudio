import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/features/auth/hooks/use-auth';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: SignupForm) => {
    registerMutation.mutate(
      { email: data.email, password: data.password, username: data.username },
      {
        onSuccess: () => {
          toast.success('Account created successfully');
          navigate('/');
        },
        onError: (error) => {
          toast.error(error.message || 'Registration failed');
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, hsl(250, 30%, 8%) 0%, hsl(230, 20%, 10%) 50%, hsl(220, 25%, 8%) 100%)' }}
    >
      {/* Background gradient orbs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-15 blur-[100px] bg-mcp-cyan-600 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-10 blur-[100px] bg-mcp-purple-600 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-8 blur-[80px] bg-mcp-pink-600 pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Gradient border wrapper */}
        <div className="absolute -inset-[1px] rounded-2xl gradient-aurora opacity-30 blur-[1px]" />
        <Card className="relative border-0 shadow-2xl shadow-cyan-500/10 rounded-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto w-14 h-14 rounded-xl gradient-aurora flex items-center justify-center shadow-lg glow-teal animate-float">
              <Package className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gradient-aurora">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Sign up to start managing MCP servers
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a display name"
                  className="bg-background/50 border-border/50 focus:border-mcp-cyan-500/50 focus:ring-mcp-cyan-500/20 transition-colors"
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-xs text-red-400">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-background/50 border-border/50 focus:border-mcp-cyan-500/50 focus:ring-mcp-cyan-500/20 transition-colors"
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
                  placeholder="At least 6 characters"
                  className="bg-background/50 border-border/50 focus:border-mcp-cyan-500/50 focus:ring-mcp-cyan-500/20 transition-colors"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="bg-background/50 border-border/50 focus:border-mcp-cyan-500/50 focus:ring-mcp-cyan-500/20 transition-colors"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full h-11 gradient-aurora hover:opacity-90 text-white font-semibold shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all border-0"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-mcp-cyan-400 hover:text-mcp-cyan-300 hover:underline font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
