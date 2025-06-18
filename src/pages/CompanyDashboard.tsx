
import { CompanySidebar } from "@/components/CompanySidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollaboratorAnalytics } from "@/hooks/useCollaboratorAnalytics";
import { CompanyDashboardStats } from "@/components/company/CompanyDashboardStats";
import { CompanyPerformanceCharts } from "@/components/company/CompanyPerformanceCharts";
import { CompanyCollaboratorsList } from "@/components/company/CompanyCollaboratorsList";
import {
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  BarChart3,
  Building2,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
  const { data: analytics, isLoading, error, refetch } = useCollaboratorAnalytics();

  const handleRefresh = () => {
    refetch();
  };

  const recentActivity = analytics?.slice(0, 5).map(stat => ({
    id: stat.id,
    name: stat.collaborator.name,
    action: stat.lessons_completed > 0 ? "Completou uma lição" : "Se inscreveu na plataforma",
    time: stat.last_login_at ? new Date(stat.last_login_at).toLocaleDateString('pt-BR') : "Nunca acessou",
    avatar: stat.collaborator.name.split(' ').map(n => n[0]).join('').toUpperCase()
  })) || [];

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <CompanySidebar />
          <main className="flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              <header className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <SidebarTrigger />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Painel da Empresa</h1>
                      <p className="text-gray-600">Carregando dados...</p>
                    </div>
                  </div>
                </div>
              </header>
              <div className="flex-1 p-6 bg-gray-50">
                <div className="animate-pulse space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map((i) => (
                      <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <CompanySidebar />
          <main className="flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              <header className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <SidebarTrigger />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Painel da Empresa</h1>
                      <p className="text-gray-600">Erro ao carregar dados</p>
                    </div>
                  </div>
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              </header>
              <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-red-500 mb-4">Erro ao carregar dados dos colaboradores</p>
                    <Button onClick={handleRefresh}>Tentar Novamente</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
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
                    <p className="text-gray-600">
                      Gestão Completa de Treinamentos - {analytics?.length || 0} colaboradores
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                  <Badge className="ai-gradient text-white border-0">
                    Plano: Enterprise
                  </Badge>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="space-y-6">
                {/* Estatísticas Principais */}
                {analytics && analytics.length > 0 && (
                  <CompanyDashboardStats collaborators={analytics} />
                )}

                {/* Gráficos de Performance */}
                {analytics && analytics.length > 0 && (
                  <CompanyPerformanceCharts collaborators={analytics} />
                )}

                {/* Grid Principal */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left Column - 2/3 width */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Lista de Colaboradores */}
                    {analytics && analytics.length > 0 && (
                      <CompanyCollaboratorsList 
                        collaborators={analytics}
                        onViewDetails={(id) => {
                          // Implementar navegação para detalhes do colaborador
                          console.log('Ver detalhes do colaborador:', id);
                        }}
                      />
                    )}

                    {/* Atividade Recente */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                          Atividade Recente
                        </CardTitle>
                        <CardDescription>
                          Últimas atividades dos colaboradores na plataforma
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {recentActivity.length > 0 ? (
                          <div className="space-y-4">
                            {recentActivity.map((activity) => (
                              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {activity.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900">
                                    {activity.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {activity.action}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {activity.time}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">
                            Nenhuma atividade recente encontrada
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - 1/3 width */}
                  <div className="space-y-6">
                    {/* Ações Rápidas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button asChild className="w-full justify-start" variant="outline">
                          <Link to="/company/collaborators">
                            <Users className="h-4 w-4 mr-2" />
                            Gerenciar Colaboradores
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                          <Link to="/analytics">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics Detalhado
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                          <Link to="/company/mentorships">
                            <Calendar className="h-4 w-4 mr-2" />
                            Calendário de Mentorias
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                          <Link to="/company-profile">
                            <Building2 className="h-4 w-4 mr-2" />
                            Perfil da Empresa
                          </Link>
                        </Button>
                        <Button className="w-full justify-start ai-gradient hover:scale-105 transition-all duration-200 text-white">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Gerenciar Plano
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Próximas Mentorias */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Calendar className="h-5 w-5 mr-2 text-green-600" />
                          Próximas Mentorias
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">
                                Mentoria: Liderança em IA
                              </h4>
                              <p className="text-sm text-gray-600">
                                Dr. Ana Silva
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                15 Dez, 14:00 • 12 participantes
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">
                                Mentoria: Desenvolvimento Ágil
                              </h4>
                              <p className="text-sm text-gray-600">
                                Prof. Carlos Santos
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                18 Dez, 10:00 • 8 participantes
                              </p>
                            </div>
                          </div>
                          
                          <Button asChild variant="outline" className="w-full" size="sm">
                            <Link to="/company/mentorships">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              Ver Calendário Completo
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Plano & Uso */}
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
                            <span className="text-sm">Colaboradores Ativos</span>
                            <span className="font-medium">
                              {analytics?.filter(c => c.collaborator.is_active).length || 0}/100
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm">Plano Atual</span>
                            <Badge className="ai-gradient text-white border-0">Enterprise</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Renovação</span>
                            <span className="text-sm text-gray-500">15 Jan 2025</span>
                          </div>
                          
                          <Button variant="outline" className="w-full" size="sm">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            Fazer Upgrade
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Mensagem de estado vazio */}
                {(!analytics || analytics.length === 0) && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum colaborador encontrado</h3>
                      <p className="text-gray-600 mb-4">
                        Adicione colaboradores para começar a acompanhar o progresso de treinamento
                      </p>
                      <Button asChild>
                        <Link to="/company/collaborators">
                          Adicionar Colaboradores
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CompanyDashboard;
