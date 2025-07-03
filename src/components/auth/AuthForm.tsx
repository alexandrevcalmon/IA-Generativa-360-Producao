
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: string;
  setRole: (role: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing session corruption before attempting login
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (cleanupError) {
      console.log('Pre-login cleanup completed');
    }
    
    // Track login attempts for better UX
    const now = Date.now();
    if (lastAttemptTime && now - lastAttemptTime < 2000) {
      // Prevent rapid successive attempts
      return;
    }
    
    setLastAttemptTime(now);
    setLoginAttempts(prev => prev + 1);
    
    await onSubmit(e);
  };

  const showRecoveryHint = loginAttempts >= 2;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
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

      {showRecoveryHint && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Várias tentativas de login. Verifique suas credenciais ou{' '}
            <ForgotPasswordDialog 
              trigger={
                <span className="text-emerald-600 hover:underline cursor-pointer">
                  redefina sua senha
                </span>
              }
            />
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button 
          type="submit" 
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
        
        <div className="text-center">
          <ForgotPasswordDialog />
        </div>
      </div>
    </form>
  );
}
