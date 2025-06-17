
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProducerDashboard from "./pages/ProducerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Courses from "./pages/Courses";
import Learning from "./pages/Learning";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCompanyDetails from "./pages/ProducerCompanyDetails";
import ProducerPlans from "./pages/ProducerPlans";
import ProdutorLayout from "./components/ProdutorLayout";
import LoginProdutor from "./pages/LoginProdutor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex w-full">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login-produtor" element={<LoginProdutor />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/producer" element={<ProdutorLayout />}>
              <Route index element={<ProducerDashboard />} />
              <Route path="companies" element={<ProducerCompanies />} />
              <Route path="companies/:id" element={<ProducerCompanyDetails />} />
              <Route path="plans" element={<ProducerPlans />} />
            </Route>
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/community" element={<Community />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
