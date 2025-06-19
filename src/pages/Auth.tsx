
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { RoleIndicator } from '@/components/auth/RoleIndicator';
import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen';
import { useAuthRedirects } from '@/hooks/auth/useAuthRedirects';
import { useAuthForm } from '@/hooks/auth/useAuthForm';
import { AlertCircle } from 'lucide-react';

export default function Auth() {
  const { user, userRole, needsPasswordChange, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    loading,
    handleSubmit
  } = useAuthForm();

  // Handle redirects for authenticated users
  useAuthRedirects({ user, userRole, authLoading, needsPasswordChange });

  // Check for error messages in URL
  const urlParams = new URLSearchParams(window.location.search);
  const errorType = urlParams.get('error');

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'unauthorized_access':
        return 'Você tentou acessar uma área que não tem permissão.';
      case 'no_user':
        return 'Você precisa fazer login para acessar esta área.';
      case 'no_role':
        return 'Sua conta não possui um perfil válido.';
      case 'unknown_role':
        return 'Sua conta possui um perfil desconhecido.';
      case 'auth_context_error':
        return 'Erro no sistema de autenticação.';
      default:
        return null;
    }
  };

  const errorMessage = errorType ? getErrorMessage(errorType) : null;

  // Priority 1: Show password change dialog if user needs to change password
  if (!authLoading && user && needsPasswordChange) {
    console.log('Showing password change dialog for user:', user.email);
    return <PasswordChangeDialog />;
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Calmon Academy
          </CardTitle>
          <CardDescription>
            Entre em sua conta
          </CardDescription>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}
          
          <RoleIndicator role={role} />
        </CardHeader>
        <CardContent>
          <AuthTabs
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            role={role}
            setRole={setRole}
            loading={loading}
            onSubmit={handleSubmit}
          />

          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-emerald-600"
            >
              ← Voltar para o início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
