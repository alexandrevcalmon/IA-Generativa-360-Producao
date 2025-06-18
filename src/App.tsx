
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/auth/AuthProvider';
import { AuthGuard } from '@/components/AuthGuard';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import LoginProdutor from '@/pages/LoginProdutor';
import Dashboard from '@/pages/Dashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import ProducerDashboard from '@/pages/ProducerDashboard';
import CompanyDashboard from '@/pages/CompanyDashboard';
import Profile from '@/pages/Profile';
import StudentProfile from '@/pages/StudentProfile';
import ProducerProfile from '@/pages/ProducerProfile';
import CompanyProfile from '@/pages/CompanyProfile';
import Courses from '@/pages/Courses';
import StudentCourses from '@/pages/StudentCourses';
import ProducerCourses from '@/pages/ProducerCourses';
import StudentCourseDetail from '@/pages/StudentCourseDetail';
import StudentLessonView from '@/pages/StudentLessonView';
import CourseDetails from '@/pages/CourseDetails';
import Learning from '@/pages/Learning';
import Community from '@/pages/Community';
import StudentCommunity from '@/pages/StudentCommunity';
import ProducerCommunity from '@/pages/ProducerCommunity';
import Analytics from '@/pages/Analytics';
import StudentAnalytics from '@/pages/StudentAnalytics';
import ProducerCollaboratorsAnalytics from '@/pages/ProducerCollaboratorsAnalytics';
import StudentCalendar from '@/pages/StudentCalendar';
import StudentMentorship from '@/pages/StudentMentorship';
import ProducerMentorship from '@/pages/ProducerMentorship';
import StudentGamification from '@/pages/StudentGamification';
import ProducerCompanies from '@/pages/ProducerCompanies';
import ProducerCompanyDetails from '@/pages/ProducerCompanyDetails';
import ProducerPlans from '@/pages/ProducerPlans';
import NotFound from '@/pages/NotFound';
import { TopicView } from '@/components/community/TopicView';

function App() {
  const queryClient = new QueryClient();

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
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
              
              {/* Student routes - now all use StudentLayout internally */}
              <Route path="/student" element={<AuthGuard><StudentDashboard /></AuthGuard>} />
              <Route path="/student/profile" element={<AuthGuard><StudentProfile /></AuthGuard>} />
              <Route path="/student/courses" element={<AuthGuard><StudentCourses /></AuthGuard>} />
              <Route path="/student/courses/:courseId" element={<AuthGuard><StudentCourseDetail /></AuthGuard>} />
              <Route path="/student/courses/:courseId/:moduleId/:lessonId" element={<AuthGuard><StudentLessonView /></AuthGuard>} />
              <Route path="/student/community" element={<AuthGuard><StudentCommunity /></AuthGuard>} />
              <Route path="/student/analytics" element={<AuthGuard><StudentAnalytics /></AuthGuard>} />
              <Route path="/student/calendar" element={<AuthGuard><StudentCalendar /></AuthGuard>} />
              <Route path="/student/mentorship" element={<AuthGuard><StudentMentorship /></AuthGuard>} />
              <Route path="/student/gamification" element={<AuthGuard><StudentGamification /></AuthGuard>} />
              
              <Route path="/producer" element={<AuthGuard><ProducerDashboard /></AuthGuard>} />
              <Route path="/producer/profile" element={<AuthGuard><ProducerProfile /></AuthGuard>} />
              <Route path="/producer/courses" element={<AuthGuard><ProducerCourses /></AuthGuard>} />
              <Route path="/producer/courses/:courseId" element={<AuthGuard><CourseDetails /></AuthGuard>} />
              <Route path="/producer/community" element={<AuthGuard><ProducerCommunity /></AuthGuard>} />
              <Route path="/producer/analytics" element={<AuthGuard><ProducerCollaboratorsAnalytics /></AuthGuard>} />
              <Route path="/producer/mentorship" element={<AuthGuard><ProducerMentorship /></AuthGuard>} />
              <Route path="/producer/companies" element={<AuthGuard><ProducerCompanies /></AuthGuard>} />
              <Route path="/producer/companies/:companyId" element={<AuthGuard><ProducerCompanyDetails /></AuthGuard>} />
              <Route path="/producer/plans" element={<AuthGuard><ProducerPlans /></AuthGuard>} />
              
              <Route path="/company" element={<AuthGuard><CompanyDashboard /></AuthGuard>} />
              <Route path="/company/profile" element={<AuthGuard><CompanyProfile /></AuthGuard>} />
              
              <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
              <Route path="/courses" element={<AuthGuard><Courses /></AuthGuard>} />
              <Route path="/learning" element={<AuthGuard><Learning /></AuthGuard>} />
              <Route path="/community" element={<AuthGuard><Community /></AuthGuard>} />
              <Route path="/community/topic/:topicId" element={<AuthGuard><TopicView /></AuthGuard>} />
              <Route path="/analytics" element={<AuthGuard><Analytics /></AuthGuard>} />
              
              {/* 404 page */}
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
