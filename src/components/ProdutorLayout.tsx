
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const ProdutorLayout = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  console.log('ProdutorLayout - Auth state:', { user: !!user, userRole, loading });

  useEffect(() => {
    if (loading) return;

    if (!user) {
      console.log('ProdutorLayout: No user, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (userRole !== 'producer') {
      console.log(`ProdutorLayout: User role ${userRole} is not producer, redirecting`);
      // Redirect to appropriate dashboard based on actual role
      switch (userRole) {
        case 'company':
          navigate('/company-dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/auth');
      }
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user || userRole !== 'producer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecionando...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProdutorLayout;
