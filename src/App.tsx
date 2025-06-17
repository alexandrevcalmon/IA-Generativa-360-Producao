
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProdutorLayout from "@/components/ProdutorLayout";
import StudentLayout from "@/components/StudentLayout";
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
import StudentDashboard from "./pages/StudentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login-produtor" element={<LoginProdutor />} />
              
              {/* Protected Student Routes - Legacy */}
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
              
              {/* Protected Student Routes with Layout */}
              <Route path="/student/*" element={
                <AuthGuard requiredRole="student">
                  <StudentLayout />
                </AuthGuard>
              }>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="progress" element={<Analytics />} />
                <Route path="gamification" element={<div className="p-6">Gamificação em desenvolvimento</div>} />
                <Route path="goals" element={<div className="p-6">Objetivos em desenvolvimento</div>} />
                <Route path="community" element={<Community />} />
                <Route path="settings" element={<Profile />} />
              </Route>
              
              {/* Protected Producer Routes with Layout */}
              <Route path="/producer/*" element={
                <AuthGuard requiredRole="producer">
                  <ProdutorLayout />
                </AuthGuard>
              }>
                <Route path="dashboard" element={<ProducerDashboard />} />
                <Route path="courses" element={<ProducerCourses />} />
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route path="companies" element={<ProducerCompanies />} />
                <Route path="companies/:companyId" element={<ProducerCompanyDetails />} />
                <Route path="plans" element={<ProducerPlans />} />
              </Route>
              
              {/* Protected Company Routes */}
              <Route path="/company/dashboard" element={
                <AuthGuard requiredRole="company">
                  <CompanyDashboard />
                </AuthGuard>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
