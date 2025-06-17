
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
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  Building2,
  CreditCard
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = {
  main: [
    { title: "Dashboard", url: "/producer-dashboard", icon: LayoutDashboard },
    { title: "Meus Cursos", url: "/producer/courses", icon: BookOpen },
    { title: "Empresas", url: "/producer/companies", icon: Building2 },
    { title: "Planos", url: "/producer/plans", icon: CreditCard },
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
          <div className="w-10 h-10">
            <img 
              src="/logo-calmon-academy.png" 
              alt="Calmon Academy" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg text-sidebar-foreground">Calmon Academy</h2>
            <p className="text-sm text-sidebar-foreground/70">Painel do Produtor</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
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
            PRODUCER
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
