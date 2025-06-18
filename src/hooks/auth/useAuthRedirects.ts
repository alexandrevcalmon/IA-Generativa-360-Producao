
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseAuthRedirectsProps {
  user: any;
  userRole: string | null;
  authLoading: boolean;
  needsPasswordChange: boolean;
}

export function useAuthRedirects({ user, userRole, authLoading, needsPasswordChange }: UseAuthRedirectsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth redirect check:', {
      authLoading,
      user: user?.email,
      userRole,
      needsPasswordChange
    });

    // Only redirect if all conditions are met
    if (!authLoading && user && userRole && !needsPasswordChange) {
      console.log('Redirecting authenticated user. Role:', userRole);
      
      switch (userRole) {
        case 'producer':
          console.log('Redirecting to producer dashboard');
          navigate('/producer-dashboard', { replace: true });
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
          console.log('Unknown role, redirecting to student dashboard');
          navigate('/student/dashboard', { replace: true });
      }
    }
  }, [user, userRole, authLoading, needsPasswordChange, navigate]);
}
