import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/auth/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Learning from "./pages/Learning";
import Community from "./pages/Community";
import LoginProdutor from "./pages/LoginProdutor";
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerProfile from "./pages/ProducerProfile";
import ProducerCourses from "./pages/ProducerCourses";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCompanyDetails from "./pages/ProducerCompanyDetails";
import ProducerPlans from "./pages/ProducerPlans";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentCourses from "./pages/StudentCourses";
import StudentCourseDetail from "./pages/StudentCourseDetail";
import StudentLessonView from "./pages/StudentLessonView";
import StudentGamification from "./pages/StudentGamification";
import StudentMentorship from "./pages/StudentMentorship";
import StudentCalendar from "./pages/StudentCalendar";
import StudentCommunity from "./pages/StudentCommunity";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "@/components/AuthGuard";
import StudentLayout from "@/components/StudentLayout";
import ProducerCollaboratorsAnalytics from "./pages/ProducerCollaboratorsAnalytics";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login-produtor" element={<LoginProdutor />} />

              {/* Producer routes */}
              <Route path="/producer" element={<AuthGuard />}>
                <Route index element={<Navigate to="/producer/dashboard" replace />} />
                <Route path="dashboard" element={<ProducerDashboard />} />
                <Route path="profile" element={<ProducerProfile />} />
                <Route path="courses" element={<ProducerCourses />} />
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route path="companies" element={<ProducerCompanies />} />
                <Route path="companies/:companyId" element={<ProducerCompanyDetails />} />
                <Route path="collaborators-analytics" element={<ProducerCollaboratorsAnalytics />} />
                <Route path="plans" element={<ProducerPlans />} />
              </Route>

              {/* Company routes */}
              <Route path="/company" element={<AuthGuard />}>
                <Route index element={<Navigate to="/company/dashboard" replace />} />
                <Route path="dashboard" element={<CompanyDashboard />} />
                <Route path="profile" element={<CompanyProfile />} />
                <Route path="courses" element={<Courses />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="learning" element={<Learning />} />
                <Route path="community" element={<Community />} />
              </Route>

              {/* Student routes with StudentLayout */}
              <Route path="/student" element={<AuthGuard requiredRole="student" />}>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route element={<StudentLayout />}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="courses/:courseId" element={<StudentCourseDetail />} />
                  <Route path="gamification" element={<StudentGamification />} />
                  <Route path="mentorship" element={<StudentMentorship />} />
                  <Route path="calendar" element={<StudentCalendar />} />
                  <Route path="community" element={<StudentCommunity />} />
                </Route>
                {/* Lesson view without sidebar for better video viewing */}
                <Route path="courses/:courseId/lessons/:lessonId" element={<StudentLessonView />} />
              </Route>

              {/* Fallback routes for backward compatibility */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
