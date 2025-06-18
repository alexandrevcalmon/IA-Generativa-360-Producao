
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

export default function LoginProdutor() {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    console.log('LoginProdutor - Auth state:', { user: !!user, userRole, loading });
    
    if (loading) return;

    if (!user) {
      console.log('No user, redirecting to auth');
      navigate('/auth');
      return;
    }

    // Redirect based on actual user role
    switch (userRole) {
      case 'producer':
        console.log('Producer detected, redirecting to producer dashboard');
        navigate('/producer/dashboard');
        break;
      case 'company':
        console.log('Company detected, redirecting to company dashboard');
        navigate('/company-dashboard');
        break;
      case 'student':
        console.log('Student detected, redirecting to student dashboard');
        navigate('/student/dashboard');
        break;
      default:
        console.log('Unknown role, redirecting to auth');
        navigate('/auth');
    }
  }, [user, userRole, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">
        {loading ? 'Carregando...' : 'Redirecionando...'}
      </div>
    </div>
  );
}
