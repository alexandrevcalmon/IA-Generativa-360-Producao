
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface UseAuthRedirectsProps {
  user: User | null;
  userRole: string;
  loading: boolean;
  targetRole?: string;
  needsPasswordChange?: boolean;
}

export function useAuthRedirects({ user, userRole, loading, targetRole, needsPasswordChange }: UseAuthRedirectsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    console.log('Auth redirect check:', { user: !!user, userRole, targetRole, loading, needsPasswordChange });

    // If no user, redirect to auth
    if (!user) {
      console.log('No user, redirecting to auth');
      navigate('/auth');
      return;
    }

    // If password change is needed, don't redirect - let the component handle it
    if (needsPasswordChange) {
      console.log('Password change needed, staying on current page');
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

      // For auth page, always redirect to appropriate dashboard
      if (currentPath === '/auth' || currentPath === '/') {
        switch (userRole) {
          case 'producer':
            console.log('Redirecting producer to dashboard');
            navigate('/producer/dashboard');
            break;
          case 'company':
            console.log('Redirecting company to dashboard');
            navigate('/company-dashboard');
            break;
          case 'student':
            console.log('Redirecting student to dashboard');
            navigate('/student/dashboard');
            break;
          default:
            console.log('Unknown role, staying on auth');
            // Don't redirect for unknown roles to avoid loops
        }
      }
    }
  }, [user, userRole, loading, targetRole, needsPasswordChange, navigate]);
}
