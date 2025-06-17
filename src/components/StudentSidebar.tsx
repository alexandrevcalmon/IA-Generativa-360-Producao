
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  MessageCircle, 
  Settings,
  Target,
  Calendar,
  GraduationCap,
  Users
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const studentMenuItems = [
  {
    title: 'Dashboard',
    url: '/student/dashboard',
    icon: Home,
  },
  {
    title: 'Meus Cursos',
    url: '/student/courses',
    icon: BookOpen,
  },
  {
    title: 'Trilhas de Aprendizado',
    url: '/student/learning',
    icon: GraduationCap,
  },
  {
    title: 'Progresso',
    url: '/student/analytics',
    icon: BarChart3,
  },
  {
    title: 'Gamificação',
    url: '/student/gamification',
    icon: Trophy,
  },
  {
    title: 'Objetivos',
    url: '/student/goals',
    icon: Target,
  },
  {
    title: 'Comunidade',
    url: '/student/community',
    icon: MessageCircle,
  },
  {
    title: 'Mentoria',
    url: '/student/mentorship',
    icon: Users,
  },
  {
    title: 'Calendário',
    url: '/student/calendar',
    icon: Calendar,
  },
  {
    title: 'Perfil',
    url: '/student/profile',
    icon: Settings,
  },
];

export function StudentSidebar() {
  const { companyUserData } = useAuth();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/4e37cba3-373f-4630-ac8b-6fdea4e6d0e8.png" 
            alt="Calmon Academy" 
            className="h-8 w-auto"
          />
        </div>
        {companyUserData && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{companyUserData.name}</p>
            <p className="text-xs text-gray-600">{companyUserData.email}</p>
            {companyUserData.companies && (
              <p className="text-xs text-blue-600 mt-1">{companyUserData.companies.name}</p>
            )}
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
