
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Target,
  Calendar,
  Download,
  Share2,
  Trophy,
  Zap,
  Users,
  CheckCircle
} from "lucide-react";

const StudentAnalytics = () => {
  // Dados mockados para demonstração
  const progressData = [
    { month: 'Jan', completed: 4, total: 6 },
    { month: 'Fev', completed: 8, total: 10 },
    { month: 'Mar', completed: 12, total: 15 },
    { month: 'Abr', completed: 18, total: 20 },
    { month: 'Mai', completed: 22, total: 25 },
    { month: 'Jun', completed: 28, total: 30 },
  ];

  const studyTimeData = [
    { day: 'Seg', hours: 2.5 },
    { day: 'Ter', hours: 3.2 },
    { day: 'Qua', hours: 1.8 },
    { day: 'Qui', hours: 4.1 },
    { day: 'Sex', hours: 2.9 },
    { day: 'Sáb', hours: 5.2 },
    { day: 'Dom', hours: 3.7 },
  ];

  const skillsData = [
    { name: 'IA Generativa', value: 85, color: '#8884d8' },
    { name: 'Prompt Engineering', value: 92, color: '#82ca9d' },
    { name: 'APIs', value: 78, color: '#ffc658' },
    { name: 'Ética em IA', value: 95, color: '#ff7c7c' },
  ];

  const learningPathData = [
    { week: 'Sem 1', progress: 15 },
    { week: 'Sem 2', progress: 28 },
    { week: 'Sem 3', progress: 45 },
    { week: 'Sem 4', progress: 58 },
    { week: 'Sem 5', progress: 72 },
    { week: 'Sem 6', progress: 85 },
  ];

  const achievements = [
    {
      id: 1,
      title: "Primeiro Curso Concluído",
      description: "Parabéns por concluir seu primeiro curso!",
      icon: Trophy,
      earned: true,
      date: "15 Mai 2024"
    },
    {
      id: 2,
      title: "Streak de 7 Dias",
      description: "Estudou por 7 dias consecutivos",
      icon: Zap,
      earned: true,
      date: "22 Mai 2024"
    },
    {
      id: 3,
      title: "Expert em Prompts",
      description: "Completou 50 exercícios de prompt engineering",
      icon: Award,
      earned: true,
      date: "01 Jun 2024"
    },
    {
      id: 4,
      title: "Colaborador Ativo",
      description: "Participou de 10 discussões na comunidade",
      icon: Users,
      earned: false,
      progress: 7
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "course_completed",
      title: "Concluiu o módulo 'APIs e Integrações'",
      time: "2 horas atrás",
      icon: CheckCircle
    },
    {
      id: 2,
      type: "achievement",
      title: "Conquistou o badge 'Expert em Prompts'",
      time: "1 dia atrás",
      icon: Award
    },
    {
      id: 3,
      type: "study_session",
      title: "Sessão de estudo de 3h 15min",
      time: "2 dias atrás",
      icon: Clock
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progresso de Aprendizagem</h1>
            <p className="text-gray-600">Acompanhe seu desenvolvimento e conquistas</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cursos Concluídos</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3 este mês
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Horas de Estudo</p>
                    <p className="text-2xl font-bold text-gray-900">156h</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +24h esta semana
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conquistas</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2 esta semana
                    </p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Streak Atual</p>
                    <p className="text-2xl font-bold text-gray-900">12 dias</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <Zap className="h-3 w-3 mr-1" />
                      Recorde pessoal!
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <Tabs defaultValue="progress" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="progress">Progresso</TabsTrigger>
              <TabsTrigger value="time">Tempo de Estudo</TabsTrigger>
              <TabsTrigger value="skills">Habilidades</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progresso Mensal</CardTitle>
                    <CardDescription>
                      Cursos concluídos vs. cursos iniciados por mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#8884d8" name="Concluídos" />
                        <Bar dataKey="total" fill="#82ca9d" name="Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evolução da Trilha</CardTitle>
                    <CardDescription>
                      Progresso semanal na trilha atual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={learningPathData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="progress" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="time" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tempo de Estudo Semanal</CardTitle>
                  <CardDescription>
                    Horas dedicadas ao estudo por dia da semana
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={studyTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Habilidades</CardTitle>
                    <CardDescription>
                      Nível de proficiência por área
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={skillsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {skillsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progresso por Habilidade</CardTitle>
                    <CardDescription>
                      Nível atual em cada área de conhecimento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillsData.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conquistas Recentes</CardTitle>
                    <CardDescription>
                      Badges e certificações conquistadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                          achievement.earned 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          <achievement.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          {achievement.earned ? (
                            <p className="text-xs text-green-600 mt-1">
                              Conquistado em {achievement.date}
                            </p>
                          ) : (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progresso</span>
                                <span>{achievement.progress}/10</span>
                              </div>
                              <Progress value={(achievement.progress! / 10) * 100} className="h-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                    <CardDescription>
                      Suas últimas atividades de aprendizagem
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <activity.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
