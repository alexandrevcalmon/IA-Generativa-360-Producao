
import { CompanySidebar } from "@/components/CompanySidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle,
  Eye,
  Building2,
  CreditCard,
  ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
  const teamMembers = [
    {
      name: "João Silva",
      role: "Desenvolvedor",
      progress: 78,
      lastActivity: "2 horas atrás",
      courses: 3,
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Maria Santos",
      role: "Designer",
      progress: 92,
      lastActivity: "1 hora atrás",
      courses: 5,
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Pedro Costa",
      role: "Product Manager",
      progress: 65,
      lastActivity: "3 horas atrás",
      courses: 2,
      avatar: "/api/placeholder/40/40"
    }
  ];

  const companyStats = [
    {
      title: "Colaboradores Ativos",
      value: "47",
      change: "+5 este mês",
      icon: Users
    },
    {
      title: "Horas de Treinamento",
      value: "1,247h",
      change: "+23% vs último mês",
      icon: Clock
    },
    {
      title: "Cursos Completados",
      value: "89",
      change: "+12 esta semana",
      icon: CheckCircle
    },
    {
      title: "ROI do Treinamento",
      value: "340%",
      change: "+45% este trimestre",
      icon: TrendingUp
    }
  ];

  const upcomingMentorships = [
    {
      title: "Mentoria: Liderança em IA",
      date: "15 Dez, 14:00",
      participants: 12,
      mentor: "Dr. Ana Silva"
    },
    {
      title: "Mentoria: Desenvolvimento Ágil",
      date: "18 Dez, 10:00",
      participants: 8,
      mentor: "Prof. Carlos Santos"
    },
    {
      title: "Mentoria: Gestão de Produtos",
      date: "20 Dez, 16:00",
      participants: 15,
      mentor: "Marina Costa"
    }
  ];

  return (
    <>
      <CompanySidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Painel da Empresa</h1>
                  <p className="text-gray-600">TechCorp Solutions - Gestão de Treinamentos</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="ai-gradient text-white border-0">
                  Plano: Enterprise
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {companyStats.map((stat, index) => (
                  <Card key={index} className="hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Team Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-600" />
                          Progresso da Equipe
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Relatório Completo
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Acompanhe o desenvolvimento dos seus colaboradores
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900">
                                {member.name}
                              </h4>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span>{member.courses} cursos ativos</span>
                                <span>•</span>
                                <span>{member.lastActivity}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Progress value={member.progress} className="h-2 flex-1" />
                                <span className="text-xs font-medium">{member.progress}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-purple-600" />
                        Analytics da Empresa
                      </CardTitle>
                      <CardDescription>
                        Métricas de desempenho e engajamento da equipe
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">87%</div>
                          <div className="text-sm text-gray-600">Taxa de Conclusão</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">42h</div>
                          <div className="text-sm text-gray-600">Média por Colaborador</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">4.9</div>
                          <div className="text-sm text-gray-600">Satisfação Média</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <h4 className="font-medium">Departamentos com Melhor Performance</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Tecnologia</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={94} className="w-20 h-2" />
                              <span className="text-sm font-medium">94%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Marketing</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={87} className="w-20 h-2" />
                              <span className="text-sm font-medium">87%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Vendas</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={76} className="w-20 h-2" />
                              <span className="text-sm font-medium">76%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link to="/company/courses">
                        <Button className="w-full justify-start" variant="outline">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Ver Cursos Ativos
                        </Button>
                      </Link>
                      <Link to="/company/mentorships">
                        <Button className="w-full justify-start" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Calendário de Mentorias
                        </Button>
                      </Link>
                      <Link to="/company/profile">
                        <Button className="w-full justify-start" variant="outline">
                          <Building2 className="h-4 w-4 mr-2" />
                          Perfil da Empresa
                        </Button>
                      </Link>
                      <Link to="/company/plan">
                        <Button className="w-full justify-start ai-gradient hover:scale-105 transition-all duration-200 text-white">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Gerenciar Plano
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Upcoming Online Mentorships */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-2 text-green-600" />
                        Próximas Mentorias Online
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingMentorships.map((mentorship, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">
                                {mentorship.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {mentorship.mentor}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {mentorship.date} • {mentorship.participants} participantes
                              </p>
                            </div>
                          </div>
                        ))}
                        <Link to="/company/mentorships">
                          <Button variant="outline" className="w-full" size="sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            Ver Calendário Completo
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plan & Usage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        Plano & Uso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Assentos Utilizados</span>
                          <span className="font-medium">47/100</span>
                        </div>
                        <Progress value={47} className="h-2" />
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm">Plano Atual</span>
                          <Badge className="ai-gradient text-white border-0">Enterprise</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Renovação</span>
                          <span className="text-sm text-gray-500">15 Jan 2025</span>
                        </div>
                        
                        <Link to="/company/plan">
                          <Button variant="outline" className="w-full" size="sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            Fazer Upgrade
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CompanyDashboard;
