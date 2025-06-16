
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Clock,
  Brain,
  Play,
  Calendar,
  MessageCircle,
  Target,
  Zap,
  Trophy,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Upload,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

const ProducerDashboard = () => {
  const myCourses = [
    {
      title: "Prompt Engineering Avançado",
      students: 245,
      completion: 78,
      status: "Publicado",
      revenue: "R$ 12.450",
      thumbnail: "/api/placeholder/200/120"
    },
    {
      title: "ChatGPT para Produtividade",
      students: 189,
      completion: 92,
      status: "Publicado",
      revenue: "R$ 8.920",
      thumbnail: "/api/placeholder/200/120"
    },
    {
      title: "Saúde Mental no Trabalho",
      students: 67,
      completion: 45,
      status: "Rascunho",
      revenue: "R$ 0",
      thumbnail: "/api/placeholder/200/120"
    }
  ];

  const recentActivity = [
    {
      action: "Novo aluno matriculado",
      course: "Prompt Engineering Avançado",
      time: "2 min atrás",
      type: "enrollment"
    },
    {
      action: "Curso finalizado por aluno",
      course: "ChatGPT para Produtividade",
      time: "15 min atrás",
      type: "completion"
    },
    {
      action: "Nova avaliação recebida",
      course: "Prompt Engineering Avançado",
      time: "1 hora atrás",
      type: "review"
    }
  ];

  return (
    <>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Painel do Produtor</h1>
                  <p className="text-gray-600">Bem-vindo de volta, Prof. Silva!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-700">
                  Status: Ativo
                </Badge>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo Curso
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Cursos Criados
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      +2 este mês
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Alunos
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">
                      +89 esta semana
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Receita Total
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 21.370</div>
                    <p className="text-xs text-muted-foreground">
                      +R$ 3.240 este mês
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taxa de Conclusão
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">84%</div>
                    <p className="text-xs text-muted-foreground">
                      +5% vs mês anterior
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  {/* My Courses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-green-600" />
                          Meus Cursos
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Todos
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Gerencie e acompanhe o desempenho dos seus cursos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {myCourses.map((course, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="w-20 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded flex items-center justify-center">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {course.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{course.students} alunos</span>
                                <Badge 
                                  variant={course.status === 'Publicado' ? 'default' : 'outline'}
                                  className="text-xs"
                                >
                                  {course.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-gray-500">Conclusão:</span>
                                <Progress value={course.completion} className="h-2 flex-1" />
                                <span className="text-xs font-medium">{course.completion}%</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">
                                {course.revenue}
                              </div>
                              <div className="flex space-x-2 mt-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Editar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                        Analytics de Conteúdo
                      </CardTitle>
                      <CardDescription>
                        Acompanhe o desempenho e engajamento dos seus cursos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">4.8</div>
                          <div className="text-sm text-gray-600">Avaliação Média</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">92%</div>
                          <div className="text-sm text-gray-600">Satisfação</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">156</div>
                          <div className="text-sm text-gray-600">Avaliações</div>
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
                      <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Novo Curso
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload de Conteúdo
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Criar Material
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Suporte ao Aluno
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Atividade Recente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === 'enrollment' ? 'bg-green-500' :
                              activity.type === 'completion' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">
                                {activity.action}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {activity.course}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full" size="sm">
                          Ver Todas Atividades
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                        Desempenho
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Cursos Ativos</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Em Desenvolvimento</span>
                          <span className="font-medium">4</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Aprovações Pendentes</span>
                          <span className="font-medium">2</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Ranking Geral</span>
                            <Badge className="bg-yellow-100 text-yellow-700">#12</Badge>
                          </div>
                        </div>
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

export default ProducerDashboard;
