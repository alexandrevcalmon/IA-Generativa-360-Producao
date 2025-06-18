
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { RoleIndicator } from '@/components/auth/RoleIndicator';
import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen';
import { useAuthRedirects } from '@/hooks/auth/useAuthRedirects';
import { useAuthForm } from '@/hooks/auth/useAuthForm';
import { useEffect } from 'react';

export default function Auth() {
  const { user, userRole, needsPasswordChange, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
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

  // Set role from URL parameter if provided
  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole && ['producer', 'company', 'student'].includes(urlRole)) {
      setRole(urlRole);
    }
  }, [searchParams, setRole]);

  // Handle redirects for authenticated users
  useAuthRedirects({ 
    user, 
    userRole, 
    loading: authLoading, 
    needsPasswordChange 
  });

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
