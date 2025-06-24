
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PasswordChangeDialog() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { changePassword, refreshUserRole, needsPasswordChange, user } = useAuth();
  const { toast } = useToast();

  // Guard against premature unmounting and ensure dialog stays visible when needed
  useEffect(() => {
    console.log('🔐 PasswordChangeDialog effect:', {
      needsPasswordChange,
      user: user?.email,
      isVisible
    });

    if (needsPasswordChange && user && !isVisible) {
      console.log('🔐 Showing password change dialog');
      setIsVisible(true);
    } else if (!needsPasswordChange && isVisible) {
      console.log('🔐 Password change no longer needed, will hide dialog');
      // Add a small delay to prevent flashing
      setTimeout(() => setIsVisible(false), 100);
    }
  }, [needsPasswordChange, user, isVisible]);

  // Additional protection: don't render if conditions aren't met
  if (!needsPasswordChange || !user || !isVisible) {
    console.log('🔐 PasswordChangeDialog not rendering:', {
      needsPasswordChange,
      hasUser: !!user,
      isVisible
    });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro na confirmação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔐 Attempting password change for user:', user.email);
      const { error } = await changePassword(newPassword);
      
      if (error) {
        console.error('❌ Password change failed:', error);
        toast({
          title: "Erro ao alterar senha",
          description: error.message || "Ocorreu um erro ao alterar a senha.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Password changed successfully, refreshing user role...');
        
        toast({
          title: "Senha alterada com sucesso!",
          description: "Redirecionando para o dashboard...",
        });

        // Add delay to ensure database changes are committed and refresh user data
        setTimeout(async () => {
          try {
            console.log('🔄 Refreshing user role after password change...');
            await refreshUserRole();
            console.log('✅ User role refreshed after password change');
          } catch (refreshError) {
            console.error('⚠️ Error refreshing user role:', refreshError);
            // Don't show error to user as password change was successful
            // The system should still work with the updated password
          }
        }, 2000); // Increased delay to ensure proper state update
      }
    } catch (error: any) {
      console.error('❌ Unexpected error during password change:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a alteração da senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('🔐 Rendering PasswordChangeDialog for user:', user.email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mx-auto mb-4">
            <Lock className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Por segurança, você precisa criar uma nova senha para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p>Sua nova senha deve ter:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Pelo menos 6 caracteres</li>
                <li>Ser diferente da senha padrão</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? 'Alterando senha...' : 'Alterar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
