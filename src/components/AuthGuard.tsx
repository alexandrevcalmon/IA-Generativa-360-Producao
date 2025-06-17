
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'producer' | 'company' | 'student';
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo = '/auth' }: AuthGuardProps) {
  const { user, loading, userRole, needsPasswordChange, refreshUserRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  // Refresh user role when component mounts or user changes
  useEffect(() => {
    if (user && !loading) {
      refreshUserRole();
    }
  }, [user, loading, refreshUserRole]);

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

  // Show password change dialog if needed
  if (needsPasswordChange) {
    return <PasswordChangeDialog />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
