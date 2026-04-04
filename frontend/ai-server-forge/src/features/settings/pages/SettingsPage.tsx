import { Palette, Globe, User, Database, Info, LogOut, RotateCcw } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { useOnboardingStore } from '@/features/onboarding/stores/onboarding-store';
import ThemeToggle from '../components/ThemeToggle';
import ApiConfig from '../components/ApiConfig';
import DataManagement from '../components/DataManagement';

const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const { resetTour, startTour } = useOnboardingStore();

  return (
    <MainLayout title="Settings" subtitle="Configure your MCPStudio experience">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl p-6 gradient-cool shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-xl font-bold text-white mb-1">Settings</h2>
            <p className="text-white/70 text-sm">Manage appearance, API configuration, and local data</p>
          </div>
        </div>

        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/30">
            <TabsTrigger value="appearance" className="text-xs gap-1.5">
              <Palette className="h-3.5 w-3.5" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="api" className="text-xs gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              API
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs gap-1.5">
              <User className="h-3.5 w-3.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="data" className="text-xs gap-1.5">
              <Database className="h-3.5 w-3.5" />
              Data
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs gap-1.5">
              <Info className="h-3.5 w-3.5" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h3>
            <ThemeToggle />
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div>
                <p className="text-sm font-medium">Guided Tour</p>
                <p className="text-xs text-muted-foreground">Replay the onboarding walkthrough</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { resetTour(); startTour(); }}>
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Restart Tour
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">API Configuration</h3>
            <ApiConfig />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Profile</h3>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium">{user?.username || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || 'No email'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Data Management</h3>
            <DataManagement />
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">About</h3>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Application</span>
                  <span className="font-medium">MCPStudio</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-xs">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Description</span>
                  <span>The Postman for MCP</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                Create, test, manage, and discover Model Context Protocol servers with a visual interface.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
