
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Building2, GraduationCap, Briefcase } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user, userRole, needsPasswordChange, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set role from URL parameter
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'company', 'producer'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [searchParams]);

  // Priority 1: Show password change dialog if user needs to change password
  if (!authLoading && user && needsPasswordChange) {
    console.log('Showing password change dialog for user:', user.email);
    return <PasswordChangeDialog />;
  }

  // Priority 2: Handle redirects for authenticated users who don't need password change
  useEffect(() => {
    console.log('Auth redirect check:', {
      authLoading,
      user: user?.email,
      userRole,
      needsPasswordChange
    });

    // Only redirect if:
    // 1. Not loading
    // 2. User is authenticated
    // 3. User role is determined
    // 4. User doesn't need password change
    if (!authLoading && user && userRole && !needsPasswordChange) {
      console.log('Redirecting authenticated user. Role:', userRole);
      
      switch (userRole) {
        case 'producer':
          console.log('Redirecting to producer dashboard');
          navigate('/producer/dashboard', { replace: true });
          break;
        case 'company':
          console.log('Redirecting to company dashboard');
          navigate('/company/dashboard', { replace: true });
          break;
        case 'student':
          console.log('Redirecting to student dashboard');
          navigate('/student/dashboard', { replace: true });
          break;
        default:
          console.log('Unknown role, redirecting to student dashboard');
          navigate('/student/dashboard', { replace: true });
      }
    }
  }, [user, userRole, authLoading, needsPasswordChange, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login for:', email);
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Login error:', error);
          // Error handling is done in the useAuth hook with toast
        } else {
          console.log('Login successful');
          // Redirect will be handled by useEffect above based on needsPasswordChange
        }
      } else {
        console.log('Attempting signup for:', email, 'with role:', role);
        const { error } = await signUp(email, password, role);
        if (!error) {
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-lg">Verificando autenticação...</div>
      </div>
    );
  }

  const getRoleInfo = () => {
    switch (role) {
      case 'producer':
        return {
          icon: <Briefcase className="h-5 w-5" />,
          title: 'Produtor de Conteúdo',
          description: 'Crie e gerencie conteúdos educacionais'
        };
      case 'company':
        return {
          icon: <Building2 className="h-5 w-5" />,
          title: 'Empresa',
          description: 'Gerencie equipes e acompanhe o desenvolvimento'
        };
      default:
        return {
          icon: <GraduationCap className="h-5 w-5" />,
          title: 'Colaborador/Estudante',
          description: 'Acesse cursos e desenvolva suas habilidades'
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Calmon Academy
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Entre em sua conta' : 'Crie sua conta'}
          </CardDescription>
          
          {/* Role indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-gray-50 rounded-lg">
            {roleInfo.icon}
            <div className="text-left">
              <div className="font-semibold text-sm text-gray-900">{roleInfo.title}</div>
              <div className="text-xs text-gray-600">{roleInfo.description}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'register'} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login" 
                onClick={() => setIsLogin(true)}
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                onClick={() => setIsLogin(false)}
              >
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
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

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

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
