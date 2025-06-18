
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/auth";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import CompanyCollaborators from "./pages/CompanyCollaborators";
import CompanyCollaboratorsAnalytics from "./pages/CompanyCollaboratorsAnalytics";
import ProducerCollaboratorsAnalytics from "./pages/ProducerCollaboratorsAnalytics";
import ProducerMentorship from "./pages/ProducerMentorship";
import CompanyProfile from "./pages/CompanyProfile";
import CourseProgressPage from "./components/company/CourseProgressPage";
import LoginProdutor from "./pages/LoginProdutor";
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerCompanies from "./pages/ProducerCompanies";
import ProducerCourses from "./pages/ProducerCourses";
import ProducerCommunity from "./pages/ProducerCommunity";
import ProducerPlans from "./pages/ProducerPlans";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";

import { ChangePassword } from "./components/auth/ChangePassword";
import { ResetPassword } from "./components/auth/ResetPassword";
import CompanyLayout from "./components/CompanyLayout";
import ProdutorLayout from "./components/ProdutorLayout";
import StudentLayout from "./components/StudentLayout";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyCourses from "./pages/CompanyCourses";
import CompanyMentorships from "./pages/CompanyMentorships";

const queryClient = new QueryClient();

function App() {
  console.log('App: Initializing application...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/change-password" element={<ChangePassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/login-produtor" element={<LoginProdutor />} />

            {/* Private Routes */}
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth role="admin">
                  <Admin />
                </RequireAuth>
              }
            />
            
            {/* Producer Routes */}
            <Route path="/producer" element={<ProdutorLayout />}>
              <Route path="dashboard" element={<ProducerDashboard />} />
              <Route path="companies" element={<ProducerCompanies />} />
              <Route path="courses" element={<ProducerCourses />} />
              <Route path="community" element={<ProducerCommunity />} />
              <Route path="plans" element={<ProducerPlans />} />
              <Route path="collaborators-analytics" element={<ProducerCollaboratorsAnalytics />} />
              <Route path="mentorship" element={<ProducerMentorship />} />
            </Route>
            
            {/* Company Routes */}
            <Route path="/company-dashboard" element={<CompanyLayout />}>
              <Route index element={<CompanyDashboard />} />
            </Route>
            <Route path="/company" element={<CompanyLayout />}>
              <Route path="collaborators" element={<CompanyCollaborators />} />
              <Route path="collaborators-analytics" element={<CompanyCollaboratorsAnalytics />} />
              <Route path="courses" element={<CompanyCourses />} />
              <Route path="course-progress" element={<CourseProgressPage />} />
              <Route path="mentorships" element={<CompanyMentorships />} />
              <Route path="profile" element={<CompanyProfile />} />
            </Route>
            
            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
            </Route>
            
            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

function RequireAuth({ children, role }: { children: JSX.Element; role?: string }) {
  console.log('RequireAuth: Checking authentication...');
  
  const { user, loading, userRole } = useAuth();

  if (loading) {
    console.log('RequireAuth: Loading...');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('RequireAuth: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (role && userRole !== role) {
    console.log('RequireAuth: Role mismatch', { userRole, requiredRole: role });
    return <div>Unauthorized</div>;
  }

  console.log('RequireAuth: Access granted');
  return children;
}

export default App;
