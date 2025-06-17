
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth";
import { AuthGuard } from "@/components/AuthGuard";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LoginProdutor from "./pages/LoginProdutor";

// Producer pages
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerCourses from "./pages/ProducerCourses";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCompanyDetails from "./pages/ProducerCompanyDetails";
import ProducerPlans from "./pages/ProducerPlans";
import ProducerProfile from "./pages/ProducerProfile";

// Company pages
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";

// Student pages
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentCourseDetail from "./pages/StudentCourseDetail";
import StudentLearning from "./pages/StudentLearning";
import StudentAnalytics from "./pages/StudentAnalytics";
import StudentCommunity from "./pages/StudentCommunity";
import StudentProfile from "./pages/StudentProfile";
import Learning from "./pages/Learning";

// Layouts
import ProdutorLayout from "./components/ProdutorLayout";
import CompanyLayout from "./components/CompanyLayout";
import StudentLayout from "./components/StudentLayout";

const queryClient = new QueryClient();

// Legacy layout wrapper for backward compatibility
const LegacyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login-produtor" element={<LoginProdutor />} />
            
            {/* Producer Routes */}
            <Route path="/producer" element={<ProdutorLayout />}>
              <Route path="dashboard" element={<ProducerDashboard />} />
              <Route path="courses" element={<ProducerCourses />} />
              <Route path="courses/:courseId" element={<CourseDetails />} />
              <Route path="companies" element={<ProducerCompanies />} />
              <Route path="companies/:companyId" element={<ProducerCompanyDetails />} />
              <Route path="plans" element={<ProducerPlans />} />
              <Route path="profile" element={<ProducerProfile />} />
            </Route>

            {/* Company Routes */}
            <Route path="/company" element={<CompanyLayout />}>
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="profile" element={<CompanyProfile />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="courses/:courseId" element={<StudentCourseDetail />} />
              <Route path="learning" element={<StudentLearning />} />
              <Route path="analytics" element={<StudentAnalytics />} />
              <Route path="community" element={<StudentCommunity />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="gamification" element={<div className="p-6"><h1 className="text-2xl font-bold">Gamificação</h1><p>Funcionalidade em desenvolvimento</p></div>} />
              <Route path="goals" element={<div className="p-6"><h1 className="text-2xl font-bold">Objetivos</h1><p>Funcionalidade em desenvolvimento</p></div>} />
              <Route path="mentorship" element={<div className="p-6"><h1 className="text-2xl font-bold">Mentoria</h1><p>Funcionalidade em desenvolvimento</p></div>} />
              <Route path="calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendário</h1><p>Funcionalidade em desenvolvimento</p></div>} />
            </Route>

            {/* Legacy Routes (for backward compatibility) - wrapped with SidebarProvider and AuthGuard */}
            <Route path="/dashboard" element={<LegacyLayout><Dashboard /></LegacyLayout>} />
            <Route path="/courses" element={<LegacyLayout><Courses /></LegacyLayout>} />
            <Route path="/learning" element={<LegacyLayout><Learning /></LegacyLayout>} />
            <Route path="/community" element={<LegacyLayout><Community /></LegacyLayout>} />
            <Route path="/analytics" element={<LegacyLayout><Analytics /></LegacyLayout>} />
            <Route 
              path="/profile" 
              element={
                <AuthGuard requiredRole="producer">
                  <LegacyLayout><Profile /></LegacyLayout>
                </AuthGuard>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
