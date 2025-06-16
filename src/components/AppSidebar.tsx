
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  MessageCircle,
  Award,
  Settings,
  User,
  Brain,
  Calendar
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = {
  main: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Meus Cursos", url: "/courses", icon: BookOpen },
    { title: "Trilha de Aprendizagem", url: "/learning", icon: Brain },
    { title: "Comunidade", url: "/community", icon: MessageCircle },
    { title: "Mentorias", url: "/mentorship", icon: Calendar },
  ],
  analytics: [
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Leaderboard", url: "/leaderboard", icon: Award },
  ],
  account: [
    { title: "Perfil", url: "/profile", icon: User },
    { title: "Configurações", url: "/settings", icon: Settings },
  ],
};

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0 bg-sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 ai-gradient rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-sidebar-foreground">IA Generativa</h2>
            <p className="text-sm text-sidebar-foreground/70">360º Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {/* User Profile Card */}
        <div className="mb-6 p-4 rounded-lg bg-sidebar-accent">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="ai-gradient text-white font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground truncate">
                João Desenvolver
              </p>
              <p className="text-sm text-sidebar-foreground/70">
                Desenvolvedor Full Stack
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                Starter 50
              </Badge>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sidebar-foreground/70">Nível 12</span>
              <span className="text-sidebar-foreground/70">2,840 XP</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-sidebar-foreground/60">
              160 XP para próximo nível
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs font-semibold tracking-wider">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs font-semibold tracking-wider">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.analytics.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs font-semibold tracking-wider">
            Conta
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.account.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
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
        <div className="flex items-center justify-between text-xs text-sidebar-foreground/60">
          <span>v1.1.0</span>
          <Badge variant="outline" className="text-xs">
            PRO
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
