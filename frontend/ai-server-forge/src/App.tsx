
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewServer from "./pages/NewServer";
import ServerDetail from "./pages/ServerDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/new-server" element={<NewServer />} />
          <Route path="/server/:id" element={<ServerDetail />} />
          <Route path="/tools" element={<Index />} /> {/* Placeholder routes */}
          <Route path="/resources" element={<Index />} />
          <Route path="/prompts" element={<Index />} />
          <Route path="/docs" element={<Index />} />
          <Route path="/support" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
