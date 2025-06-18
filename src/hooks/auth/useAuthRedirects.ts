
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface UseAuthRedirectsProps {
  user: User | null;
  userRole: string;
  loading: boolean;
  targetRole?: string;
}

export function useAuthRedirects({ user, userRole, loading, targetRole }: UseAuthRedirectsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    console.log('Auth redirect check:', { user: !!user, userRole, targetRole, loading });

    // If no user, redirect to auth
    if (!user) {
      console.log('No user, redirecting to auth');
      navigate('/auth');
      return;
    }

    // If we have a target role and user doesn't match, redirect appropriately
    if (targetRole && userRole !== targetRole) {
      console.log(`User role ${userRole} doesn't match target ${targetRole}, redirecting`);
      
      switch (userRole) {
        case 'producer':
          navigate('/producer/dashboard');
          break;
        case 'company':
          navigate('/company-dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/auth');
      }
      return;
    }

    // Auto-redirect based on role when no specific target
    if (!targetRole && user && userRole) {
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on correct path
      if (
        (userRole === 'producer' && currentPath.startsWith('/producer')) ||
        (userRole === 'company' && (currentPath.startsWith('/company') || currentPath === '/company-dashboard')) ||
        (userRole === 'student' && currentPath.startsWith('/student'))
      ) {
        return;
      }

      // Redirect to appropriate dashboard
      switch (userRole) {
        case 'producer':
          if (currentPath === '/' || currentPath === '/auth') {
            navigate('/producer/dashboard');
          }
          break;
        case 'company':
          if (currentPath === '/' || currentPath === '/auth') {
            navigate('/company-dashboard');
          }
          break;
        case 'student':
          if (currentPath === '/' || currentPath === '/auth') {
            navigate('/student/dashboard');
          }
          break;
      }
    }
  }, [user, userRole, loading, targetRole, navigate]);
}
