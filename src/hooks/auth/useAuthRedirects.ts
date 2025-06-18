
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseAuthRedirectsProps {
  user: any;
  userRole: string | null;
  authLoading: boolean;
  needsPasswordChange: boolean;
}

export function useAuthRedirects({ user, userRole, authLoading, needsPasswordChange }: UseAuthRedirectsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Auth redirect check:', {
      authLoading,
      user: user?.email,
      userRole,
      needsPasswordChange,
      currentPath: location.pathname
    });

    // Don't redirect if loading, no user, or user needs password change
    if (authLoading || !user || needsPasswordChange) {
      return;
    }

    // Don't redirect if user is already on the correct dashboard
    const isOnCorrectDashboard = 
      (userRole === 'producer' && location.pathname.startsWith('/producer')) ||
      (userRole === 'company' && location.pathname.startsWith('/company')) ||
      (userRole === 'student' && location.pathname.startsWith('/student'));

    if (isOnCorrectDashboard) {
      console.log('User already on correct dashboard, no redirect needed');
      return;
    }

    // Only redirect if user is on auth pages or root page
    const shouldRedirect = 
      location.pathname === '/' || 
      location.pathname === '/auth' || 
      location.pathname === '/login-produtor';

    if (!shouldRedirect) {
      console.log('User not on redirect-eligible page, skipping redirect');
      return;
    }

    // Only redirect if all conditions are met and user has a role
    if (!authLoading && user && userRole) {
      console.log('Redirecting authenticated user. Role:', userRole);
      
      switch (userRole) {
        case 'producer':
          console.log('Redirecting to producer dashboard');
          navigate('/producer/dashboard', { replace: true });
          break;
        case 'company':
          console.log('Redirecting to company dashboard');
          navigate('/company-dashboard', { replace: true });
          break;
        case 'student':
          console.log('Redirecting to student dashboard');
          navigate('/student/dashboard', { replace: true });
          break;
        default:
          console.log('Unknown role, redirecting to auth');
          navigate('/auth', { replace: true });
      }
    }
  }, [user, userRole, authLoading, needsPasswordChange, navigate, location.pathname]);
}
