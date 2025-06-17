
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
  User,
  CreditCard,
  Calendar
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = {
  main: [
    { title: "Dashboard", url: "/company-dashboard", icon: LayoutDashboard },
    { title: "Cursos Ativos", url: "/company/courses", icon: BookOpen },
    { title: "Mentorias", url: "/company/mentorships", icon: Calendar },
  ],
  account: [
    { title: "Perfil", url: "/company/profile", icon: User },
    { title: "Plano", url: "/company/plan", icon: CreditCard },
  ],
};

export function CompanySidebar() {
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
            <p className="text-sm text-sidebar-foreground/70">Painel da Empresa</p>
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
            EMPRESA
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
