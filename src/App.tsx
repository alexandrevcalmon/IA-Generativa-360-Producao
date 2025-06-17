
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Learning from "./pages/Learning";
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerCourses from "./pages/ProducerCourses";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCompanyDetails from "./pages/ProducerCompanyDetails";
import ProducerPlans from "./pages/ProducerPlans";
import CompanyDashboard from "./pages/CompanyDashboard";
import LoginProdutor from "./pages/LoginProdutor";
import NotFound from "./pages/NotFound";
import ProdutorLayout from "./components/ProdutorLayout";
import CompanyLayout from "./components/CompanyLayout";
import StudentLayout from "./components/StudentLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login-produtor" element={<LoginProdutor />} />
              
              {/* Producer routes */}
              <Route path="/producer" element={
                <AuthGuard requiredRole="producer">
                  <ProdutorLayout />
                </AuthGuard>
              }>
                <Route path="dashboard" element={<ProducerDashboard />} />
                <Route path="courses" element={<ProducerCourses />} />
                <Route path="companies" element={<ProducerCompanies />} />
                <Route path="companies/:id" element={<ProducerCompanyDetails />} />
                <Route path="plans" element={<ProducerPlans />} />
              </Route>
              
              {/* Company routes */}
              <Route path="/company" element={
                <AuthGuard requiredRole="company">
                  <CompanyLayout />
                </AuthGuard>
              }>
                <Route path="dashboard" element={<CompanyDashboard />} />
              </Route>
              
              {/* Student routes */}
              <Route path="/student" element={
                <AuthGuard requiredRole="student">
                  <StudentLayout />
                </AuthGuard>
              }>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="progress" element={<Analytics />} />
                <Route path="gamification" element={<Community />} />
                <Route path="goals" element={<Learning />} />
                <Route path="community" element={<Community />} />
                <Route path="settings" element={<Profile />} />
              </Route>
              
              {/* Legacy routes for backwards compatibility */}
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
              <Route path="/courses/:id" element={
                <AuthGuard>
                  <CourseDetails />
                </AuthGuard>
              } />
              <Route path="/community" element={
                <AuthGuard>
                  <Community />
                </AuthGuard>
              } />
              <Route path="/analytics" element={
                <AuthGuard>
                  <Analytics />
                </AuthGuard>
              } />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/learning" element={
                <AuthGuard>
                  <Learning />
                </AuthGuard>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
