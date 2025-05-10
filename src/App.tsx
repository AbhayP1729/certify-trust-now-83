
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import AgencyLogin from "./pages/AgencyLogin";
import AgencyDashboard from "./pages/AgencyDashboard";
import OrganizationsPage from "./pages/OrganizationsPage";
import QrCodesPage from "./pages/QrCodesPage";
import CertificatesPage from "./pages/CertificatesPage";
import ReportsPage from "./pages/ReportsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/agency/login" element={<AgencyLogin />} />
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/organizations" element={<OrganizationsPage />} />
          <Route path="/agency/qr-codes" element={<QrCodesPage />} />
          <Route path="/agency/certificates" element={<CertificatesPage />} />
          <Route path="/agency/reports" element={<ReportsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
