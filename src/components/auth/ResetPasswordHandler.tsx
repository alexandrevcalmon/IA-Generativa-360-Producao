
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingTokens, setIsValidatingTokens] = useState(false);
  const [validTokens, setValidTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);
  const [resetType, setResetType] = useState<'tokens' | 'flag' | 'none'>('none');
  
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');
  const resetFlag = searchParams.get('reset');

  console.log('🔐 ResetPasswordHandler: URL Analysis', {
    fullURL: window.location.href,
    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
    refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
    type,
    resetFlag
  });

  // Determine reset type based on URL parameters
  useEffect(() => {
    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('🔐 Token-based reset detected');
      setResetType('tokens');
      setError(null);
    } else if (resetFlag === 'true' && !accessToken && !refreshToken) {
      console.log('🔐 Flag-based reset detected (check email message)');
      setResetType('flag');
      setError(null);
    } else if (type === 'recovery' && (!accessToken || !refreshToken)) {
      console.warn('⚠️ Incomplete recovery tokens');
      setResetType('none');
      setError('Link de redefinição incompleto. Solicite um novo link.');
    } else {
      console.log('🔐 No valid reset scenario detected');
      setResetType('none');
      if (!resetFlag && !type) {
        setError(null); // Don't show error if user just navigated here
      }
    }
  }, [accessToken, refreshToken, type, resetFlag]);
  
  // Validate tokens WITHOUT logging in
  useEffect(() => {
    if (resetType !== 'tokens' || !accessToken || !refreshToken || validTokens) return;
    
    const validateTokens = async () => {
      console.log('🔐 Validating recovery tokens without login...');
      setIsValidatingTokens(true);
      setError(null);
      
      try {
        // Use verifyOtp to validate tokens without creating a session
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: accessToken,
          type: 'recovery'
        });

        if (error) {
          console.error('❌ Token validation failed:', error);
          
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            setError('Link de redefinição expirado ou inválido. Solicite um novo link.');
          } else {
            setError('Erro ao validar link de redefinição. Tente novamente.');
          }
        } else if (data.user) {
          console.log('✅ Tokens validated successfully without login');
          
          // Store the validated tokens for password change
          setValidTokens({
            accessToken,
            refreshToken
          });
        } else {
          console.error('❌ No user data received after token validation');
          setError('Falha ao validar tokens de redefinição.');
        }
      } catch (err: any) {
        console.error('💥 Token validation error:', err);
        setError('Erro inesperado ao processar link de redefinição.');
      } finally {
        setIsValidatingTokens(false);
      }
    };

    validateTokens();
  }, [resetType, accessToken, refreshToken, validTokens]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validTokens) {
      setError('Tokens de redefinição inválidos. Solicite um novo link.');
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
    console.log('🔐 Attempting password change with validated tokens...');
    
    try {
      // Create a temporary session just for password update
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: validTokens.accessToken,
        refresh_token: validTokens.refreshToken
      });

      if (sessionError || !sessionData.session) {
        console.error('❌ Failed to create temporary session:', sessionError);
        setError('Erro ao estabelecer sessão temporária para alteração de senha.');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('❌ Password update failed:', updateError);
        setError(updateError.message || 'Erro ao alterar senha');
      } else {
        console.log('✅ Password changed successfully');
        
        // Sign out to clear the temporary session
        await supabase.auth.signOut();
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    } catch (err: any) {
      console.error('💥 Password change error:', err);
      setError('Erro inesperado ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  // Handle invalid reset scenarios
  if (resetType === 'none') {
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">Link de redefinição inválido</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Voltar ao login
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="w-full"
                >
                  Solicitar novo link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return null;
  }

  // Show loading during token validation
  if (resetType === 'tokens' && isValidatingTokens) {
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

  // Show password reset form for valid token-based resets
  if (resetType === 'tokens' && validTokens) {
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

  // Show error state for invalid token-based resets
  if (resetType === 'tokens' && !validTokens && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Link inválido ou expirado</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Voltar ao login
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show check email message for flag-based resets
  if (resetType === 'flag') {
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
              className="w-full"
            >
              Voltar ao login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback
  return null;
}
