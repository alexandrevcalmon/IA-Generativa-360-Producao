
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
  const [isValidatingSession, setIsValidatingSession] = useState(false);
  const [validResetSession, setValidResetSession] = useState(false);
  const [resetType, setResetType] = useState<'tokens' | 'flag' | 'none'>('none');
  const [sessionPersisted, setSessionPersisted] = useState(false);
  
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');
  const resetFlag = searchParams.get('reset');

  // Session persistence keys
  const SESSION_KEY = 'password_reset_session';
  const VALIDATION_KEY = 'password_reset_validated';
  
  // Check for existing valid session first (session persistence)
  useEffect(() => {
    const checkPersistedSession = async () => {
      try {
        // Check if we already have a persisted valid session
        const persistedValidation = sessionStorage.getItem(VALIDATION_KEY);
        const persistedSessionData = sessionStorage.getItem(SESSION_KEY);
        
        if (persistedValidation === 'true' && persistedSessionData) {
          console.log('🔐 Found persisted valid reset session');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('✅ Using persisted reset session');
            setValidResetSession(true);
            setSessionPersisted(true);
            setResetType('tokens');
            return;
          } else {
            console.log('⚠️ Persisted session expired, clearing storage');
            sessionStorage.removeItem(VALIDATION_KEY);
            sessionStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Error checking persisted session:', error);
        sessionStorage.removeItem(VALIDATION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    };

    checkPersistedSession();
  }, []);

  // Enhanced parameter parsing and validation
  useEffect(() => {
    // Skip if we already have a persisted valid session
    if (sessionPersisted) {
      console.log('🔐 Using persisted session, skipping URL validation');
      return;
    }

    console.log('🔐 ResetPasswordHandler: Detailed URL Analysis', {
      fullURL: window.location.href,
      searchParams: Object.fromEntries(searchParams),
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      type,
      resetFlag,
      hasValidTokens: !!(type === 'recovery' && accessToken && refreshToken),
      allParams: Array.from(searchParams.entries())
    });
    
    // Enhanced validation for token-based reset
    if (type === 'recovery' && accessToken && refreshToken) {
      // Validate token format (basic check)
      const isValidTokenFormat = accessToken.length > 50 && refreshToken.length > 50;
      
      if (isValidTokenFormat) {
        console.log('🔐 Valid token-based reset detected (from email link)');
        setResetType('tokens');
        setError(null); // Clear any previous errors
      } else {
        console.warn('⚠️ Invalid token format detected', {
          accessTokenLength: accessToken.length,
          refreshTokenLength: refreshToken.length
        });
        setResetType('none');
        setError('Link de redefinição inválido. Tokens malformados.');
      }
    } 
    // Check for flag-based reset (only when no tokens)
    else if (resetFlag === 'true' && !accessToken && !refreshToken) {
      console.log('🔐 Flag-based reset detected (show check email message)');
      setResetType('flag');
      setError(null);
    } 
    // Handle edge cases and invalid combinations
    else if (type === 'recovery' && (!accessToken || !refreshToken)) {
      console.warn('⚠️ Incomplete recovery tokens', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });
      setResetType('none');
      setError('Link de redefinição incompleto. Solicite um novo link.');
    }
    // No valid reset scenario
    else {
      console.log('🔐 No valid reset scenario detected');
      setResetType('none');
      setError(null);
    }
  }, [accessToken, refreshToken, type, resetFlag, searchParams, sessionPersisted]);
  
  // Validate session for token-based resets
  useEffect(() => {
    if (resetType !== 'tokens' || sessionPersisted || validResetSession) return;
    
    const validateTokens = async () => {
      console.log('🔐 Starting token validation process...');
      setIsValidatingSession(true);
      setError(null);
      
      try {
        // Clear any existing session first
        console.log('🔐 Clearing existing session...');
        await supabase.auth.signOut();
        
        // Set session with reset tokens - this consumes the one-time tokens
        console.log('🔐 Setting session with recovery tokens...');
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken!,
          refresh_token: refreshToken!
        });

        if (error) {
          console.error('❌ Token validation failed:', {
            error: error.message,
            code: error.status,
            name: error.name
          });
          
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            setError('Link de redefinição expirado ou inválido. Solicite um novo link.');
          } else {
            setError('Erro ao validar link de redefinição. Tente novamente.');
          }
          setValidResetSession(false);
        } else if (data.session && data.user) {
          console.log('✅ Token validation successful!', {
            userId: data.user.id,
            userEmail: data.user.email,
            sessionValid: !!data.session
          });
          
          // Persist the valid session to sessionStorage
          try {
            sessionStorage.setItem(VALIDATION_KEY, 'true');
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              timestamp: Date.now()
            }));
            console.log('✅ Session persisted to sessionStorage');
          } catch (persistError) {
            console.warn('⚠️ Failed to persist session:', persistError);
          }
          
          setValidResetSession(true);
        } else {
          console.error('❌ No session data received after token validation');
          setError('Falha ao estabelecer sessão de redefinição.');
          setValidResetSession(false);
        }
      } catch (err: any) {
        console.error('💥 Token validation error:', {
          message: err.message,
          stack: err.stack
        });
        setError('Erro inesperado ao processar link de redefinição.');
        setValidResetSession(false);
      } finally {
        setIsValidatingSession(false);
      }
    };

    validateTokens();
  }, [resetType, accessToken, refreshToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validResetSession) {
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
    console.log('🔐 Attempting password change...');
    
    try {
      const { error } = await changePassword(newPassword);
      if (!error) {
        console.log('✅ Password changed successfully');
        
        // Clear session storage after successful password change
        try {
          sessionStorage.removeItem(VALIDATION_KEY);
          sessionStorage.removeItem(SESSION_KEY);
          console.log('✅ Session storage cleared after password change');
        } catch (clearError) {
          console.warn('⚠️ Failed to clear session storage:', clearError);
        }
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } else {
        console.error('❌ Password change failed:', error);
        setError(error.message || 'Erro ao alterar senha');
      }
    } catch (err: any) {
      console.error('💥 Password change error:', err);
      setError('Erro inesperado ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  // Handle 'none' reset type - show error if there is one, otherwise return null
  if (resetType === 'none') {
    if (error) {
      console.log('🔐 Showing error state for invalid reset parameters');
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
    
    console.log('🔐 No reset type detected, returning null');
    return null;
  }

  // Show loading during token validation
  if (resetType === 'tokens' && isValidatingSession) {
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
  if (resetType === 'tokens' && validResetSession) {
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
  if (resetType === 'tokens' && !validResetSession && error) {
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

  // Show check email message for flag-based resets (only when no tokens present)
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
  console.log('🔐 Falling back to null (should not happen)');
  return null;
}
