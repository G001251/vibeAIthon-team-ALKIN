import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import HireSmart from "./pages/HireSmart";
import AutoMatch from "./pages/AutoMatch";
import SalaryAnalysis from "./pages/SalaryAnalysis";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <AppLayout />
                </SidebarProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="hire-smart" element={<HireSmart />} />
            <Route path="auto-match" element={<AutoMatch />} />
            <Route path="salary-analysis" element={<SalaryAnalysis />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
