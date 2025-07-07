import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Mail, Shield } from 'lucide-react';

interface InvitationData {
  email: string;
  role: string;
  company_id?: string;
  name?: string;
}

export function SecureInvitationHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingTokens, setIsValidatingTokens] = useState(false);
  const [validTokens, setValidTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [invitationType, setInvitationType] = useState<'signup' | 'recovery' | 'none'>('none');
  
  // Capture and clear tokens immediately to prevent AuthProvider from processing them
  const [capturedTokens, setCapturedTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);

  // Password validation rules
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Pelo menos uma letra maiúscula');
    if (!/[a-z]/.test(password)) errors.push('Pelo menos uma letra minúscula');
    if (!/[0-9]/.test(password)) errors.push('Pelo menos um número');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('Pelo menos um caractere especial');
    return errors;
  };

  // Immediately capture and clear tokens from URL
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    console.log('🔐 SecureInvitationHandler: Capturing tokens from URL', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      type,
      fullURL: window.location.href
    });

    if ((type === 'recovery' || type === 'signup') && accessToken && refreshToken) {
      console.log('🔐 Capturing and clearing invitation tokens from URL');
      
      // Capture tokens
      setCapturedTokens({ accessToken, refreshToken });
      setInvitationType(type as 'signup' | 'recovery');
      
      // Clear tokens from URL immediately to prevent AuthProvider processing
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('access_token');
      newSearchParams.delete('refresh_token');
      newSearchParams.delete('type');
      
      // Update URL without tokens
      const newUrl = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
      setSearchParams(newSearchParams);
    } else if (searchParams.get('reset') === 'true') {
      setInvitationType('recovery');
    } else {
      setInvitationType('none');
    }
  }, []);

  // Validate captured tokens
  useEffect(() => {
    if (invitationType === 'none' || !capturedTokens || validTokens) return;
    
    const validateTokens = async () => {
      console.log('🔐 Validating captured invitation tokens...');
      setIsValidatingTokens(true);
      setError(null);
      
      try {
        // Create a temporary session to test token validity without persisting it
        const { data, error } = await supabase.auth.setSession({
          access_token: capturedTokens.accessToken,
          refresh_token: capturedTokens.refreshToken
        });

        if (error) {
          console.error('❌ Token validation failed:', error);
          
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            setError('Link de convite expirado ou inválido. Solicite um novo convite.');
          } else {
            setError('Erro ao validar link de convite. Tente novamente.');
          }
        } else if (data.session) {
          console.log('✅ Tokens validated successfully');
          
          // Extract invitation data from user metadata
          const userData = data.session.user;
          const metadata = userData.user_metadata || userData.app_metadata || {};
          
          setInvitationData({
            email: userData.email || '',
            role: metadata.role || 'student',
            company_id: metadata.company_id,
            name: metadata.name
          });
          
          // Immediately sign out to clear the temporary session
          await supabase.auth.signOut();
          
          // Store validated tokens for password setup
          setValidTokens(capturedTokens);
        } else {
          console.error('❌ No session data received after token validation');
          setError('Falha ao validar tokens de convite.');
        }
      } catch (err: any) {  
        console.error('💥 Token validation error:', err);
        setError('Erro inesperado ao processar link de convite.');
      } finally {
        setIsValidatingTokens(false);
      }
    };

    validateTokens();
  }, [invitationType, capturedTokens, validTokens]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validTokens) {
      setError('Tokens de convite inválidos. Solicite um novo convite.');
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(`Senha não atende aos critérios: ${passwordErrors.join(', ')}`);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    console.log('🔐 Attempting secure password setup with validated tokens...');
    
    try {
      // Create a temporary session for password update
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: validTokens.accessToken,
        refresh_token: validTokens.refreshToken
      });

      if (sessionError || !sessionData.session) {
        console.error('❌ Failed to create temporary session:', sessionError);
        setError('Erro ao estabelecer sessão temporária para definição de senha.');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('❌ Password update failed:', updateError);
        setError(updateError.message || 'Erro ao definir senha');
      } else {
        console.log('✅ Password set successfully');
        
        // Update needs_password_change flag based on role
        if (invitationData?.role === 'company' && invitationData.company_id) {
          await supabase
            .from('companies')
            .update({ needs_password_change: false })
            .eq('id', invitationData.company_id);
        } else if (invitationData?.role === 'collaborator') {
          await supabase
            .from('company_users')
            .update({ needs_password_change: false })
            .eq('auth_user_id', sessionData.session.user.id);
        }
        
        // Sign out to clear the temporary session
        await supabase.auth.signOut();
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    } catch (err: any) {
      console.error('💥 Password setup error:', err);
      setError('Erro inesperado ao definir senha');
    } finally {
      setLoading(false);
    }
  };

  // Handle invalid invitation scenarios
  if (invitationType === 'none') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Link de convite inválido</h3>
            <p className="text-gray-600 mb-4">
              O link que você utilizou não é válido ou pode ter expirado.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Voltar ao login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading during token validation
  if (isValidatingTokens) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-emerald-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Validando convite...</h3>
            <p className="text-gray-600">
              Aguarde enquanto processamos seu convite de ativação.
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
            <h3 className="text-xl font-semibold mb-2">Conta ativada com sucesso!</h3>
            <p className="text-gray-600 mb-4">
              Sua conta foi ativada e sua senha foi definida com segurança. Você será redirecionado para a página de login.
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

  // Show password setup form for valid token-based invitations
  if (validTokens && invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-emerald-600 mr-2" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Ativar Conta
              </CardTitle>
            </div>
            <CardDescription>
              Defina uma senha segura para ativar sua conta
            </CardDescription>
            
            {invitationData && (
              <div className="bg-emerald-50 p-3 rounded-lg mt-3">
                <p className="text-sm text-emerald-800">
                  <strong>Email:</strong> {invitationData.email}
                </p>
                <p className="text-sm text-emerald-800">
                  <strong>Role:</strong> {invitationData.role}
                </p>
                {invitationData.name && (
                  <p className="text-sm text-emerald-800">
                    <strong>Nome:</strong> {invitationData.name}
                  </p>
                )}
              </div>
            )}
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
                  minLength={8}
                />
                <div className="text-xs text-gray-600">
                  <p>Sua senha deve conter:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Mínimo 8 caracteres</li>
                    <li>Pelo menos uma letra maiúscula</li>
                    <li>Pelo menos uma letra minúscula</li>
                    <li>Pelo menos um número</li>
                    <li>Pelo menos um caractere especial</li>
                  </ul>
                </div>
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
                  minLength={8}
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
                    Ativando conta...
                  </>
                ) : (
                  'Ativar conta'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state for invalid token-based invitations
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Convite inválido ou expirado</h3>
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

  // Show check email message for flag-based invitations
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <Mail className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-medium mb-2">Verifique seu email</h3>
          <p className="text-gray-600 mb-4">
            Enviamos as instruções de ativação de conta para seu email. 
            Clique no link recebido para definir sua senha e ativar sua conta.
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