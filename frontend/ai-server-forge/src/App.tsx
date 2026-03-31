
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "@/components/auth/AuthGuard";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NewServer from "./pages/NewServer";
import ServerDetail from "./pages/ServerDetail";
import NotFound from "./pages/NotFound";

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
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/new-server" element={<AuthGuard><NewServer /></AuthGuard>} />
          <Route path="/server/:id" element={<AuthGuard><ServerDetail /></AuthGuard>} />
          <Route path="/tools" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/resources" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/prompts" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/docs" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/support" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
