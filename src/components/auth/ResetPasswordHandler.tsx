
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export function ResetPasswordHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingSession, setIsValidatingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');
  const isReset = searchParams.get('reset') === 'true';
  
  // Check if this is a password reset URL
  const isPasswordReset = type === 'recovery' && accessToken && refreshToken;
  
  useEffect(() => {
    const validateResetSession = async () => {
      if (!isPasswordReset) {
        console.log('🔐 Not a password reset URL, skipping session validation');
        setIsValidatingSession(false);
        return;
      }

      console.log('🔐 Processing password reset tokens...');
      console.log('Access token present:', !!accessToken);
      console.log('Refresh token present:', !!refreshToken);
      
      try {
        setIsValidatingSession(true);
        
        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken!,
          refresh_token: refreshToken!
        });

        if (error) {
          console.error('❌ Failed to set session with reset tokens:', error);
          setError('Link de redefinição inválido ou expirado. Solicite um novo link.');
          setHasValidSession(false);
        } else if (data.session && data.user) {
          console.log('✅ Session established successfully for user:', data.user.email);
          setHasValidSession(true);
          setError(null);
        } else {
          console.error('❌ No session or user data received');
          setError('Falha ao estabelecer sessão de redefinição. Tente novamente.');
          setHasValidSession(false);
        }
      } catch (err: any) {
        console.error('💥 Critical error validating reset session:', err);
        setError('Erro inesperado ao processar link de redefinição.');
        setHasValidSession(false);
      } finally {
        setIsValidatingSession(false);
      }
    };

    validateResetSession();
  }, [isPasswordReset, accessToken, refreshToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!hasValidSession) {
      setError('Sessão de redefinição inválida. Solicite um novo link.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    console.log('🔐 Attempting to change password...');
    
    try {
      const { error } = await changePassword(newPassword);
      if (!error) {
        console.log('✅ Password changed successfully');
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } else {
        console.error('❌ Password change failed:', error);
        setError(error.message || 'Erro ao alterar senha');
      }
    } catch (err: any) {
      console.error('💥 Critical error changing password:', err);
      setError('Erro inesperado ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  // Only show if it's a password reset request
  if (!isPasswordReset && !isReset) {
    return null;
  }

  // Show loading while validating session
  if (isValidatingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-emerald-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Validando link de redefinição...</h3>
            <p className="text-gray-600">
              Aguarde enquanto processamos seu link de redefinição de senha.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Senha alterada com sucesso!</h3>
            <p className="text-gray-600 mb-4">
              Sua senha foi redefinida. Você será redirecionado para a página de login.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Ir para login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show password reset form if we have valid tokens and session
  if (isPasswordReset && hasValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Redefinir Senha
            </CardTitle>
            <CardDescription>
              Digite sua nova senha abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite novamente sua nova senha"
                  required
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Alterando senha...
                  </>
                ) : (
                  'Alterar senha'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if session validation failed
  if (isPasswordReset && !hasValidSession && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Link inválido ou expirado</h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="mr-2"
            >
              Voltar ao login
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show info message if just the reset flag is present
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-medium mb-2">Verifique seu email</h3>
          <p className="text-gray-600 mb-4">
            Enviamos as instruções de redefinição de senha para seu email. 
            Clique no link recebido para continuar.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline"
          >
            Voltar ao login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
