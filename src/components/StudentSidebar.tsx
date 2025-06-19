
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

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/logo-calmon-academy.png" 
            alt="Calmon Academy" 
            className="h-8 w-8 flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-sidebar-foreground truncate">Calmon Academy</span>
            <span className="text-xs text-sidebar-foreground/70 capitalize truncate">
              {userRole === 'collaborator' ? 'Colaborador' : 'Estudante'}
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
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

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
