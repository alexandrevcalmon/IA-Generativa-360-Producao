
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
    console.log('🔄 Enhanced auth redirect evaluation:', {
      authLoading,
      user: user?.email,
      userRole,
      needsPasswordChange,
      currentPath: location.pathname,
      search: location.search,
      timestamp: new Date().toISOString()
    });

    // Don't redirect if loading, no user, or user needs password change
    if (authLoading || !user || needsPasswordChange) {
      console.log('⏸️ Skipping redirect:', {
        reason: authLoading ? 'loading' : !user ? 'no user' : 'needs password change'
      });
      return;
    }

    // Don't redirect if user is already on the correct dashboard
    const isOnCorrectDashboard = 
      (userRole === 'producer' && location.pathname.startsWith('/producer')) ||
      (userRole === 'company' && location.pathname.startsWith('/company')) ||
      (userRole === 'student' && location.pathname.startsWith('/student')) ||
      (userRole === 'collaborator' && location.pathname.startsWith('/student')); // Collaborators use student dashboard

    if (isOnCorrectDashboard) {
      console.log('✅ User already on correct dashboard, no redirect needed');
      return;
    }

    // Check for role-specific auth page access
    const urlParams = new URLSearchParams(location.search);
    const requestedRole = urlParams.get('role');
    
    // If user is on auth page with specific role request
    if (location.pathname === '/auth' && requestedRole) {
      console.log('🔍 Auth page with role request:', { requestedRole, userRole });
      
      // If requesting producer access but user is not a producer
      if (requestedRole === 'producer' && userRole !== 'producer') {
        console.log('❌ Producer access denied - user is not a producer');
        // Stay on auth page to show error or redirect to appropriate dashboard
        if (userRole) {
          switch (userRole) {
            case 'company':
              navigate('/company/dashboard', { replace: true });
              break;
            case 'student':
            case 'collaborator':
              navigate('/student/dashboard', { replace: true });
              break;
            default:
              console.log('Unknown role, staying on auth page');
          }
        }
        return;
      }
      
      // If user has the requested role, redirect to appropriate dashboard
      if (requestedRole === userRole) {
        console.log('✅ Role matches request, redirecting to dashboard');
        switch (userRole) {
          case 'producer':
            navigate('/producer/dashboard', { replace: true });
            break;
          case 'company':
            navigate('/company/dashboard', { replace: true });
            break;
          case 'student':
          case 'collaborator':
            navigate('/student/dashboard', { replace: true });
            break;
        }
        return;
      }
    }

    // Only redirect from specific "entry" pages
    const shouldRedirect = 
      location.pathname === '/' || 
      location.pathname === '/auth' || 
      location.pathname === '/login-produtor' ||
      location.pathname === '/company-dashboard'; // Add legacy route

    if (!shouldRedirect) {
      console.log('ℹ️ Not on redirect-eligible page, skipping redirect. Current:', location.pathname);
      return;
    }

    // Perform role-based redirect
    if (userRole) {
      console.log('🚀 Performing role-based redirect. Role:', userRole);
      
      switch (userRole) {
        case 'producer':
          console.log('📊 Redirecting producer to dashboard');
          navigate('/producer/dashboard', { replace: true });
          break;
        case 'company':
          console.log('🏢 Redirecting company to dashboard');
          navigate('/company/dashboard', { replace: true });
          break;
        case 'student':
          console.log('🎓 Redirecting student to dashboard');
          navigate('/student/dashboard', { replace: true });
          break;
        case 'collaborator':
          console.log('👥 Redirecting collaborator to student dashboard');
          navigate('/student/dashboard', { replace: true });
          break;
        default:
          console.warn('❓ Unknown role, redirecting to auth. Role:', userRole);
          navigate('/auth', { replace: true });
      }
    } else {
      console.warn('⚠️ User has no role assigned, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [user, userRole, authLoading, needsPasswordChange, navigate, location.pathname, location.search]);
}
