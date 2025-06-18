
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
import ProducerMentorship from "./pages/ProducerMentorship";
import CompanyProfile from "./pages/CompanyProfile";

import { ChangePassword } from "./components/auth/ChangePassword";
import { ResetPassword } from "./components/auth/ResetPassword";
import CompanyLayout from "./components/CompanyLayout";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyCourses from "./pages/CompanyCourses";
import CompanyMentorships from "./pages/CompanyMentorships";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/change-password" element={<ChangePassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

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
            <Route
              path="/producer-mentorship"
              element={
                <RequireAuth role="producer">
                  <ProducerMentorship />
                </RequireAuth>
              }
            />
            
            {/* Company Routes */}
            <Route path="/company-dashboard" element={<CompanyLayout />}>
              <Route index element={<CompanyDashboard />} />
            </Route>
            <Route path="/company" element={<CompanyLayout />}>
              <Route path="collaborators" element={<CompanyCollaborators />} />
              <Route path="collaborators-analytics" element={<CompanyCollaboratorsAnalytics />} />
              <Route path="courses" element={<CompanyCourses />} />
              <Route path="mentorships" element={<CompanyMentorships />} />
              <Route path="profile" element={<CompanyProfile />} />
            </Route>
            
            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

function RequireAuth({ children, role }: { children: JSX.Element; role?: string }) {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && userRole !== role) {
    return <div>Unauthorized</div>;
  }

  return children;
}

export default App;
