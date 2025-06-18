
import { AuthForm } from './AuthForm';

interface AuthTabsProps {
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
    <div className="w-full">
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
    </div>
  );
}
