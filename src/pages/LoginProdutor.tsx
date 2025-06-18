import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

export default function LoginProdutor() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  useEffect(() => {
    // Redirect to auth page with producer context
    if (!user) {
      navigate('/auth');
    } else if (userRole === 'producer') {
      navigate('/producer/dashboard');
    } else {
      navigate('/auth');
    }
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecionando...</div>
    </div>
  );
}
