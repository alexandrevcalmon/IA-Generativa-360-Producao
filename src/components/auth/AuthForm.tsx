
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  onSubmit
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            minLength={isLogin ? undefined : 6}
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

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="role">Tipo de Conta</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Colaborador/Estudante</SelectItem>
              <SelectItem value="company">Empresa</SelectItem>
              <SelectItem value="producer">Produtor de Conteúdo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isLogin ? 'Entrando...' : 'Criando conta...'}
          </>
        ) : (
          isLogin ? 'Entrar' : 'Criar Conta'
        )}
      </Button>
    </form>
  );
}
