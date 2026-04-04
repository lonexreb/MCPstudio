
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "@/features/auth/components/AuthGuard";
import Login from "@/features/auth/pages/Login";
import Signup from "@/features/auth/pages/Signup";
import Dashboard from "@/features/servers/pages/Dashboard";
import NewServer from "@/features/servers/pages/NewServer";
import ServerDetail from "@/features/servers/pages/ServerDetail";
import NotFound from "./pages/NotFound";
import PipelineList from "@/features/pipeline/pages/PipelineList";
import PipelineEditor from "@/features/pipeline/pages/PipelineEditor";
import Arena from "@/features/execution/pages/Arena";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/new-server" element={<AuthGuard><NewServer /></AuthGuard>} />
          <Route path="/server/:id" element={<AuthGuard><ServerDetail /></AuthGuard>} />
          <Route path="/pipelines" element={<AuthGuard><PipelineList /></AuthGuard>} />
          <Route path="/pipelines/new" element={<AuthGuard><PipelineEditor /></AuthGuard>} />
          <Route path="/pipelines/:id" element={<AuthGuard><PipelineEditor /></AuthGuard>} />
          <Route path="/arena" element={<AuthGuard><Arena /></AuthGuard>} />
          <Route path="/tools" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/resources" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/prompts" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/docs" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/support" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
