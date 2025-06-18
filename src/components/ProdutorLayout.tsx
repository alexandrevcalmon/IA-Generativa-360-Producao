
import { useAuth } from '@/hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const ProdutorLayout = () => {
  // Add debugging to see what's happening
  console.log('ProdutorLayout: Attempting to use auth hook...');
  
  let user, loading, userRole;
  
  try {
    const authData = useAuth();
    user = authData.user;
    loading = authData.loading;
    userRole = authData.userRole;
    console.log('ProdutorLayout: Auth hook successful', { user: user?.email, userRole, loading });
  } catch (error) {
    console.error('ProdutorLayout: Error using auth hook:', error);
    // If we can't access auth context, redirect to auth page
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    console.log('ProdutorLayout: Auth loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    console.log('ProdutorLayout: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== 'producer') {
    console.log('ProdutorLayout: User role mismatch', { userRole, expected: 'producer' });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta área.</p>
          <button 
            onClick={() => window.location.href = '/auth'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  console.log('ProdutorLayout: Rendering producer layout for user:', user.email);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProdutorLayout;
