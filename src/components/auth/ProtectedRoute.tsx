import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { AuthLoadingScreen } from './AuthLoadingScreen';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'producer' | 'company' | 'student' | 'collaborator';
  fallbackPath?: string;
  allowedRoles?: string[];
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/auth',
  allowedRoles = []
}: ProtectedRouteProps) {
  const { user, loading, userRole, needsPasswordChange, refreshUserRole } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Handle validation and role checking
  useEffect(() => {
    const validateAccess = async () => {
      if (loading) return;

      console.log('🔒 ProtectedRoute validating access:', {
        path: location.pathname,
        userEmail: user?.email,
        userRole,
        requiredRole,
        allowedRoles,
        needsPasswordChange,
        hasUser: !!user
      });

      // If no user, redirect to auth
      if (!user) {
        console.log('🚫 No user found, redirecting to auth');
        setIsValidating(false);
        return;
      }

      // If no role yet, try to refresh
      if (!userRole) {
        console.log('🔄 No role detected, attempting refresh...');
        try {
          await refreshUserRole();
        } catch (error) {
          console.error('⚠️ Error refreshing user role:', error);
        }
      }

      // Check role requirements
      const hasRequiredRole = () => {
        if (!requiredRole && allowedRoles.length === 0) return true;
        if (requiredRole && userRole === requiredRole) return true;
        if (allowedRoles.length > 0 && userRole && allowedRoles.includes(userRole)) return true;
        return false;
      };

      if (userRole && !hasRequiredRole()) {
        console.warn('⚠️ Role mismatch:', {
          expected: requiredRole || allowedRoles,
          actual: userRole
        });
        setAccessDenied(true);
      } else {
        setAccessDenied(false);
      }

      setIsValidating(false);
    };

    validateAccess();
  }, [user, loading, userRole, requiredRole, allowedRoles, refreshUserRole, location.pathname]);

  // Show loading while validating
  if (loading || isValidating) {
    return <AuthLoadingScreen />;
  }

  // Redirect if no user
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Show password change dialog if needed (highest priority)
  if (needsPasswordChange) {
    console.log('🔐 Password change required for user:', user.email);
    return <PasswordChangeDialog />;
  }

  // Show access denied if role mismatch
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-red-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar esta área do sistema.
            </p>
            
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="text-left">
                  <p><strong>Role atual:</strong> {userRole || 'indefinido'}</p>
                  <p><strong>Role necessário:</strong> {requiredRole || allowedRoles.join(', ')}</p>
                  <p><strong>Usuário:</strong> {user.email}</p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full"
              >
                Voltar
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Ir para Página Inicial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Grant access if all checks pass
  console.log('✅ ProtectedRoute access granted for:', user.email, 'with role:', userRole);
  return <>{children}</>;
}