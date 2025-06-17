
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

export function useAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const [searchParams] = useSearchParams();

  // Set role from URL parameter
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'company', 'producer'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login for:', email);
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Login error:', error);
        } else {
          console.log('Login successful');
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

  return {
    isLogin,
    setIsLogin,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    loading,
    handleSubmit
  };
}
