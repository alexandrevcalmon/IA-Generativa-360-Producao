
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import Index from "./pages/Index";
import Learning from "./pages/Learning";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { AuthProvider } from "./hooks/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthGuard } from "./components/AuthGuard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentCourseDetail from "./pages/StudentCourseDetail";
import StudentLessonView from "./pages/StudentLessonView";
import StudentCommunity from "./pages/StudentCommunity";
import StudentMentorship from "./pages/StudentMentorship";
import StudentCalendar from "./pages/StudentCalendar";
import StudentGamification from "./pages/StudentGamification";
import StudentAnalytics from "./pages/StudentAnalytics";
import StudentProfile from "./pages/StudentProfile";
import StudentLayout from "./components/StudentLayout";
import ProdutorLayout from "./components/ProdutorLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerCourses from "./pages/ProducerCourses";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCompanyDetails from "./pages/ProducerCompanyDetails";
import ProducerMentorship from "./pages/ProducerMentorship";
import ProducerCommunity from "./pages/ProducerCommunity";
import ProducerPlans from "./pages/ProducerPlans";
import ProducerProfile from "./pages/ProducerProfile";
import Analytics from "./pages/Analytics";
import ProducerCollaboratorsAnalytics from "./pages/ProducerCollaboratorsAnalytics";
import LoginProdutor from "./pages/LoginProdutor";
import CompanyLayout from "./components/CompanyLayout";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyCollaboratorsAnalytics from "./pages/CompanyCollaboratorsAnalytics";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login-produtor" element={<LoginProdutor />} />

              {/* Student routes */}
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<StudentCourses />} />
                <Route path="/student/courses/:courseId" element={<StudentCourseDetail />} />
                <Route path="/student/courses/:courseId/lessons/:lessonId" element={<StudentLessonView />} />
                <Route path="/student/community" element={<StudentCommunity />} />
                <Route path="/student/mentorship" element={<StudentMentorship />} />
                <Route path="/student/calendar" element={<StudentCalendar />} />
                <Route path="/student/gamification" element={<StudentGamification />} />
                <Route path="/student/analytics" element={<StudentAnalytics />} />
                <Route path="/student/profile" element={<StudentProfile />} />
              </Route>

              {/* Company routes */}
              <Route element={<CompanyLayout />}>
                <Route path="/company-dashboard" element={<CompanyDashboard />} />
                <Route path="/company/collaborators" element={<ProducerCompanies />} />
                <Route path="/company/collaborators-analytics" element={<CompanyCollaboratorsAnalytics />} />
                <Route path="/company/courses" element={<ProducerCourses />} />
                <Route path="/company/mentorships" element={<ProducerMentorship />} />
                <Route path="/company-profile" element={<CompanyProfile />} />
              </Route>

              {/* Producer routes */}
              <Route element={<ProdutorLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/producer-dashboard" element={<ProducerDashboard />} />
                <Route path="/producer/courses" element={<ProducerCourses />} />
                <Route path="/producer/companies" element={<ProducerCompanies />} />
                <Route path="/producer/companies/:id" element={<ProducerCompanyDetails />} />
                <Route path="/producer/mentorship" element={<ProducerMentorship />} />
                <Route path="/producer/community" element={<ProducerCommunity />} />
                <Route path="/producer/plans" element={<ProducerPlans />} />
                <Route path="/producer/profile" element={<ProducerProfile />} />
              </Route>

              {/* Shared routes that require authentication */}
              <Route element={<AuthGuard />}>
                <Route path="/learning" element={<Learning />} />
                <Route path="/community" element={<Community />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/analytics/collaborators" element={<ProducerCollaboratorsAnalytics />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
