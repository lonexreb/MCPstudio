
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, hsl(250, 30%, 8%) 0%, hsl(230, 20%, 10%) 50%, hsl(220, 25%, 8%) 100%)' }}
    >
      {/* Background gradient orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full opacity-15 blur-[100px] bg-mcp-pink-600 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-10 blur-[100px] bg-mcp-orange-600 pointer-events-none" />

      <div className="text-center space-y-6 max-w-md p-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-2xl gradient-sunset flex items-center justify-center shadow-xl animate-float">
            <Compass className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-gradient-warm">404</h1>
        <p className="text-xl text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button asChild className="gradient-brand hover:gradient-brand-hover text-white border-0 shadow-md hover:shadow-lg hover:shadow-purple-500/20 h-11 px-6">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
