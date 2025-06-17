
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'producer' | 'company' | 'student';
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo = '/auth' }: AuthGuardProps) {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate(redirectTo);
        return;
      }

      if (requiredRole && userRole !== requiredRole) {
        // Redirect based on user role
        switch (userRole) {
          case 'producer':
            navigate('/producer-dashboard');
            break;
          case 'company':
            navigate('/company-dashboard');
            break;
          case 'student':
            navigate('/learning');
            break;
          default:
            navigate('/auth');
        }
      }
    }
  }, [user, loading, userRole, requiredRole, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
