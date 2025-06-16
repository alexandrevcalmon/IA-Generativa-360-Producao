
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Award,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

const Analytics = () => {
  const kpis = [
    {
      title: "Horas de Estudo",
      value: "47.5h",
      change: "+12%",
      trend: "up",
      period: "Este mês"
    },
    {
      title: "Cursos Concluídos",
      value: "12",
      change: "+3",
      trend: "up", 
      period: "Este mês"
    },
    {
      title: "Taxa de Conclusão",
      value: "89%",
      change: "+5%",
      trend: "up",
      period: "Média geral"
    },
    {
      title: "Streak Atual",
      value: "12 dias",
      change: "Recorde: 15",
      trend: "neutral",
      period: "Sequência ativa"
    }
  ];

  const weeklyProgress = [
    { day: "Seg", hours: 2.5, target: 3 },
    { day: "Ter", hours: 1.8, target: 3 },
    { day: "Qua", hours: 3.2, target: 3 },
    { day: "Qui", hours: 2.1, target: 3 },
    { day: "Sex", hours: 2.8, target: 3 },
    { day: "Sáb", hours: 1.5, target: 2 },
    { day: "Dom", hours: 0.8, target: 2 }
  ];

  const courseProgress = [
    {
      course: "Prompt Engineering Avançado",
      progress: 75,
      timeSpent: "12h 30min",
      lastAccessed: "2 horas atrás",
      category: "IA Generativa"
    },
    {
      course: "APIs e Integrações",
      progress: 45,
      timeSpent: "8h 15min",
      lastAccessed: "1 dia atrás",
      category: "Desenvolvimento"
    },
    {
      course: "Saúde Mental no Trabalho",
      progress: 30,
      timeSpent: "4h 45min",
      lastAccessed: "3 dias atrás",
      category: "Bem-estar"
    },
    {
      course: "Ética em IA",
      progress: 100,
      timeSpent: "6h 20min",
      lastAccessed: "1 semana atrás",
      category: "Ética"
    }
  ];

  const achievements = [
    {
      name: "Primeiro Curso",
      description: "Complete seu primeiro curso",
      earned: true,
      earnedDate: "15 dias atrás",
      icon: "🏆"
    },
    {
      name: "Streak Master",
      description: "Mantenha um streak de 7 dias",
      earned: true,
      earnedDate: "5 dias atrás",
      icon: "🔥"
    },
    {
      name: "Quiz Expert",
      description: "Acerte 90% em 5 quizzes seguidos",
      earned: true,
      earnedDate: "3 dias atrás",
      icon: "🧠"
    },
    {
      name: "Community Helper",
      description: "Ajude 10 pessoas na comunidade",
      earned: false,
      progress: 7,
      target: 10,
      icon: "💪"
    },
    {
      name: "Speed Learner",
      description: "Complete 3 cursos em uma semana",
      earned: false,
      progress: 1,
      target: 3,
      icon: "⚡"
    }
  ];

  const learningInsights = [
    {
      title: "Melhor Horário",
      value: "14:00 - 16:00",
      description: "Você é mais produtivo à tarde",
      icon: "⏰"
    },
    {
      title: "Tipo Preferido",
      value: "Vídeos Interativos",
      description: "85% do seu tempo em conteúdo interativo",
      icon: "🎯"
    },
    {
      title: "Velocidade Média",
      value: "1.2x",
      description: "Velocidade de reprodução preferida",
      icon: "⚡"
    },
    {
      title: "Foco Total",
      value: "23 min",
      description: "Tempo médio de sessão sem pausa",
      icon: "🎯"
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
                  <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-gray-600">Acompanhe seu progresso e desempenho</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                <Button className="ai-gradient text-white" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, index) => (
                  <Card key={index} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {kpi.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {kpi.value}
                          </p>
                        </div>
                        <div className={`p-2 rounded-full ${
                          kpi.trend === 'up' ? 'bg-green-100' : 
                          kpi.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {kpi.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <BarChart3 className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                          {kpi.change}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {kpi.period}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Analytics Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="courses">Cursos</TabsTrigger>
                  <TabsTrigger value="achievements">Conquistas</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Weekly Progress Chart */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                          Progresso Semanal (Horas)
                        </CardTitle>
                        <CardDescription>
                          Suas horas de estudo vs meta diária
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {weeklyProgress.map((day, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className="w-12 text-sm font-medium text-gray-600">
                                {day.day}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-500">
                                    {day.hours}h de {day.target}h
                                  </span>
                                  <span className="text-sm font-medium">
                                    {Math.round((day.hours / day.target) * 100)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={(day.hours / day.target) * 100} 
                                  className="h-2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Estatísticas Rápidas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tempo Total</span>
                          <span className="font-semibold">47h 35min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Média Diária</span>
                          <span className="font-semibold">2h 15min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Melhor Dia</span>
                          <span className="font-semibold">Quarta (3h 12min)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">XP Ganho</span>
                          <span className="font-semibold">+2,840 XP</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Ranking</span>
                          <span className="font-semibold">#7 na empresa</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Progresso dos Cursos</CardTitle>
                      <CardDescription>
                        Acompanhe seu avanço em cada curso
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {courseProgress.map((course, index) => (
                          <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {course.course}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{course.timeSpent}</span>
                                  <span>•</span>
                                  <span>{course.lastAccessed}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {course.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900 mb-1">
                                  {course.progress}%
                                </div>
                                {course.progress === 100 && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    Concluído
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className={`${
                        achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {achievement.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">
                                {achievement.description}
                              </p>
                              
                              {achievement.earned ? (
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-green-100 text-green-700">
                                    Conquistado
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {achievement.earnedDate}
                                  </span>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Progresso</span>
                                    <span className="font-medium">
                                      {achievement.progress}/{achievement.target}
                                    </span>
                                  </div>
                                  <Progress 
                                    value={(achievement.progress! / achievement.target!) * 100} 
                                    className="h-2"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {learningInsights.map((insight, index) => (
                      <Card key={index} className="text-center">
                        <CardContent className="p-6">
                          <div className="text-3xl mb-3">{insight.icon}</div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-lg font-bold text-blue-600 mb-2">
                            {insight.value}
                          </p>
                          <p className="text-sm text-gray-600">
                            {insight.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recomendações Personalizadas</CardTitle>
                      <CardDescription>
                        Com base no seu padrão de aprendizagem
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <Target className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-blue-900 mb-1">
                                Otimize seu horário de estudo
                              </h5>
                              <p className="text-sm text-blue-700">
                                Você é mais produtivo entre 14:00-16:00. Considere agendar sessões mais longas nesse período.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Award className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-green-900 mb-1">
                                Próxima conquista em vista
                              </h5>
                              <p className="text-sm text-green-700">
                                Você está a apenas 3 ajudas na comunidade de ganhar o badge "Community Helper"!
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-purple-900 mb-1">
                                Conecte-se com peers
                              </h5>
                              <p className="text-sm text-purple-700">
                                Colaboradores com perfil similar estão estudando "Automação com IA". Considere formar um grupo de estudo.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Analytics;
