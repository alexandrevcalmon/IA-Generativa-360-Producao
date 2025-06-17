
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Learning from "./pages/Learning";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import LoginProdutor from "./pages/LoginProdutor";
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerCourses from "./pages/ProducerCourses";
import CourseDetails from "./pages/CourseDetails";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCompanyDetails from "./pages/ProducerCompanyDetails";
import ProducerPlans from "./pages/ProducerPlans";
import CompanyDashboard from "./pages/CompanyDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login-produtor" element={<LoginProdutor />} />
            
            {/* Protected Student Routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/courses" element={
              <AuthGuard>
                <Courses />
              </AuthGuard>
            } />
            <Route path="/learning" element={
              <AuthGuard>
                <Learning />
              </AuthGuard>
            } />
            <Route path="/community" element={
              <AuthGuard>
                <Community />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            <Route path="/analytics" element={
              <AuthGuard>
                <Analytics />
              </AuthGuard>
            } />
            
            {/* Protected Producer Routes */}
            <Route path="/producer/dashboard" element={
              <AuthGuard>
                <ProducerDashboard />
              </AuthGuard>
            } />
            <Route path="/producer/courses" element={
              <AuthGuard>
                <ProducerCourses />
              </AuthGuard>
            } />
            <Route path="/producer/courses/:courseId" element={
              <AuthGuard>
                <CourseDetails />
              </AuthGuard>
            } />
            <Route path="/producer/companies" element={
              <AuthGuard>
                <ProducerCompanies />
              </AuthGuard>
            } />
            <Route path="/producer/companies/:companyId" element={
              <AuthGuard>
                <ProducerCompanyDetails />
              </AuthGuard>
            } />
            <Route path="/producer/plans" element={
              <AuthGuard>
                <ProducerPlans />
              </AuthGuard>
            } />
            
            {/* Protected Company Routes */}
            <Route path="/company/dashboard" element={
              <AuthGuard>
                <CompanyDashboard />
              </AuthGuard>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
