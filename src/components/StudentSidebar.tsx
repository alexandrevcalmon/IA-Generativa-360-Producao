
import {
  BookOpen,
  BarChart3,
  Calendar,
  MessageCircle,
  Trophy,
  User,
  Home,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { UserMenu } from "./UserMenu";
import { useAuth } from "@/hooks/auth";
import { useCollaboratorData } from "@/hooks/useCollaboratorData";
import { Link } from "react-router-dom";

const studentMenuItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: Home,
  },
  {
    title: "Meus Cursos",
    url: "/student/courses",
    icon: BookOpen,
  },
  {
    title: "Calendário",
    url: "/student/calendar",
    icon: Calendar,
  },
  {
    title: "Comunidade",
    url: "/student/community",
    icon: MessageCircle,
  },
  {
    title: "Mentoria",
    url: "/student/mentorship",
    icon: Users,
  },
  {
    title: "Gamificação",
    url: "/student/gamification",
    icon: Trophy,
  },
  {
    title: "Analytics",
    url: "/student/analytics",
    icon: BarChart3,
  },
  {
    title: "Perfil",
    url: "/student/profile",
    icon: User,
  },
];

export function StudentSidebar() {
  const { user, userRole } = useAuth();
  const { data: collaboratorData } = useCollaboratorData();

  // Determine display information based on user role
  const displayInfo = {
    logo: collaboratorData?.company?.logo_url || "/logo-calmon-academy.png",
    title: collaboratorData?.company?.name || "Calmon Academy",
    userName: collaboratorData?.name || user?.email || "Usuário",
    userRole: userRole === 'collaborator' ? 'Colaborador' : 'Estudante'
  };

  return (
    <Sidebar className="border-r border-yellow-200 bg-gradient-to-b from-yellow-50 to-amber-50">
      <SidebarHeader className="border-b border-yellow-200 p-4 bg-gradient-to-r from-amber-100 to-yellow-100">
        <div className="flex items-center gap-2">
          <img 
            src={displayInfo.logo}
            alt={displayInfo.title}
            className="h-8 w-8 flex-shrink-0 object-contain"
            onError={(e) => {
              // Fallback to default logo if company logo fails to load
              e.currentTarget.src = "/logo-calmon-academy.png";
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-amber-800 truncate">
              {displayInfo.title}
            </span>
            <span className="text-xs text-amber-600 truncate">
              {displayInfo.userName}
            </span>
            <span className="text-xs text-amber-500 truncate">
              {displayInfo.userRole}
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-700">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-amber-700 hover:bg-yellow-100 hover:text-amber-800">
                    <Link to={item.url}>
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

      <SidebarFooter className="border-t border-yellow-200 p-2 bg-gradient-to-r from-amber-50 to-yellow-50">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
