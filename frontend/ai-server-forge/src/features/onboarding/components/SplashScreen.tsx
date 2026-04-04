import { Package, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '../stores/onboarding-store';

const SplashScreen = () => {
  const { isOnboardingDone, isTourActive, startTour, skipTour } = useOnboardingStore();

  if (isOnboardingDone || isTourActive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <button onClick={skipTour} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
        <X className="h-5 w-5" />
      </button>

      <div className="text-center space-y-8 max-w-md px-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-2xl gradient-brand flex items-center justify-center shadow-2xl glow-purple animate-float">
            <Package className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gradient-brand">Welcome to MCPStudio</h1>
          <p className="text-muted-foreground">
            The Postman for Model Context Protocol. Create, test, and manage MCP servers with a visual interface.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={startTour} className="gradient-brand shadow-lg text-base py-5">
            Take the Tour
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <button onClick={skipTour} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
