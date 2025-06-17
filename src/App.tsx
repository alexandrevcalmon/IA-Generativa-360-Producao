
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import LoginProdutor from '@/pages/LoginProdutor';
import Dashboard from '@/pages/Dashboard';
import CompanyDashboard from '@/pages/CompanyDashboard';
import Learning from '@/pages/Learning';
import Courses from '@/pages/Courses';
import Community from '@/pages/Community';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

// Producer pages
import ProdutorLayout from '@/components/ProdutorLayout';
import ProducerDashboard from '@/pages/ProducerDashboard';
import ProducerCompanies from '@/pages/ProducerCompanies';
import ProducerCompanyDetails from '@/pages/ProducerCompanyDetails';
import ProducerPlans from '@/pages/ProducerPlans';
import ProducerCourses from '@/pages/ProducerCourses';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
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
                <Route index element={<Navigate to="/producer/dashboard" replace />} />
                <Route path="dashboard" element={<ProducerDashboard />} />
                <Route path="companies" element={<ProducerCompanies />} />
                <Route path="companies/:id" element={<ProducerCompanyDetails />} />
                <Route path="plans" element={<ProducerPlans />} />
                <Route path="courses" element={<ProducerCourses />} />
              </Route>
              
              {/* Company routes */}
              <Route path="/company-dashboard" element={
                <AuthGuard requiredRole="company">
                  <CompanyDashboard />
                </AuthGuard>
              } />
              
              {/* Student/Collaborator routes */}
              <Route path="/learning" element={
                <AuthGuard requiredRole="student">
                  <Learning />
                </AuthGuard>
              } />
              <Route path="/courses" element={
                <AuthGuard requiredRole="student">
                  <Courses />
                </AuthGuard>
              } />
              <Route path="/community" element={
                <AuthGuard requiredRole="student">
                  <Community />
                </AuthGuard>
              } />
              
              {/* Protected routes for all authenticated users */}
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Dashboard />
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
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
