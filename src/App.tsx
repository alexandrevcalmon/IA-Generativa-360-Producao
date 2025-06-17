import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import StudentCourses from "./pages/StudentCourses";
import Learning from "./pages/Learning";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProdutorLayout from "./components/ProdutorLayout";
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerCourses from "./pages/ProducerCourses";
import CourseDetails from "./pages/CourseDetails";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCompanyDetails from "./pages/ProducerCompanyDetails";
import ProducerPlans from "./pages/ProducerPlans";
import LoginProdutor from "./pages/LoginProdutor";
import CompanyLayout from "./components/CompanyLayout";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentLayout from "./components/StudentLayout";
import StudentDashboard from "./pages/StudentDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import StudentLearning from "./pages/StudentLearning";
import StudentAnalytics from "./pages/StudentAnalytics";
import StudentCommunity from "./pages/StudentCommunity";
import StudentProfile from "./pages/StudentProfile";

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
            </Route>

            {/* Company Routes */}
            <Route path="/company" element={<CompanyLayout />}>
              <Route path="dashboard" element={<CompanyDashboard />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="learning" element={<StudentLearning />} />
              <Route path="community" element={<StudentCommunity />} />
              <Route path="analytics" element={<StudentAnalytics />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="gamification" element={<div className="p-6"><h1 className="text-2xl font-bold">Gamificação</h1><p>Funcionalidade em desenvolvimento</p></div>} />
              <Route path="goals" element={<div className="p-6"><h1 className="text-2xl font-bold">Objetivos</h1><p>Funcionalidade em desenvolvimento</p></div>} />
              <Route path="mentorship" element={<div className="p-6"><h1 className="text-2xl font-bold">Mentoria</h1><p>Funcionalidade em desenvolvimento</p></div>} />
              <Route path="calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendário</h1><p>Funcionalidade em desenvolvimento</p></div>} />
            </Route>

            {/* Legacy Routes (for backward compatibility) - wrapped with SidebarProvider */}
            <Route path="/dashboard" element={<LegacyLayout><Dashboard /></LegacyLayout>} />
            <Route path="/courses" element={<LegacyLayout><Courses /></LegacyLayout>} />
            <Route path="/learning" element={<LegacyLayout><Learning /></LegacyLayout>} />
            <Route path="/community" element={<LegacyLayout><Community /></LegacyLayout>} />
            <Route path="/analytics" element={<LegacyLayout><Analytics /></LegacyLayout>} />
            <Route path="/profile" element={<LegacyLayout><Profile /></LegacyLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
