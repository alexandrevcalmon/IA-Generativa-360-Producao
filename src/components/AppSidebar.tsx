
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  Home, 
  Building2, 
  CreditCard, 
  BookOpen,
  BarChart3,
  Users,
  MessageCircle,
  LogOut 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

export function AppSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/producer/dashboard'
    },
    {
      title: 'Empresas',
      icon: Building2,
      href: '/producer/companies'
    },
    {
      title: 'Cursos',
      icon: BookOpen,
      href: '/producer/courses'
    },
    {
      title: 'Mentoria',
      icon: MessageCircle,
      href: '/producer/mentorship'
    },
    {
      title: 'Planos',
      icon: CreditCard,
      href: '/producer/plans'
    },
    {
      title: 'Analytics Colaboradores',
      icon: Users,
      href: '/producer/collaborators-analytics'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/analytics'
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-calmon-600 rounded flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-bold text-lg">Calmon Academy</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <Link to={item.href} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
