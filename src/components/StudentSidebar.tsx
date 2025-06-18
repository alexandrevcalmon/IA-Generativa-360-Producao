
import { useAuth } from '@/hooks/auth';
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
  MessageCircle,
  Calendar,
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
    title: 'Gamificação',
    url: '/student/gamification',
    icon: Trophy,
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
];

export function StudentSidebar() {
  const { companyUserData } = useAuth();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src="/lovable-uploads/4e37cba3-373f-4630-ac8b-6fdea4e6d0e8.png" 
            alt="Calmon Academy" 
            className="h-8 w-auto"
          />
        </div>
        {companyUserData && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 truncate">{companyUserData.name}</p>
            <p className="text-xs text-gray-600 truncate">{companyUserData.email}</p>
            {companyUserData.companies && (
              <p className="text-xs text-blue-600 mt-1 truncate">{companyUserData.companies.name}</p>
            )}
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {studentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-gray-100 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                  >
                    <Link to={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-100">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
