
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthForm } from './AuthForm';

interface AuthTabsProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: string;
  setRole: (role: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function AuthTabs({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  loading,
  onSubmit
}: AuthTabsProps) {
  return (
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
        <AuthForm
          isLogin={true}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          loading={loading}
          onSubmit={onSubmit}
        />
      </TabsContent>

      <TabsContent value="register">
        <AuthForm
          isLogin={false}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          loading={loading}
          onSubmit={onSubmit}
        />
      </TabsContent>
    </Tabs>
  );
}
