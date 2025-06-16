
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
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const recentCourses = [
    {
      title: "Prompt Engineering Avançado",
      progress: 75,
      duration: "2h 30min",
      thumbnail: "/api/placeholder/200/120",
      category: "IA Generativa"
    },
    {
      title: "ChatGPT para Produtividade",
      progress: 100,
      duration: "1h 45min",
      thumbnail: "/api/placeholder/200/120",
      category: "Ferramentas"
    },
    {
      title: "Saúde Mental no Trabalho",
      progress: 45,
      duration: "3h 15min",
      thumbnail: "/api/placeholder/200/120",
      category: "Bem-estar"
    }
  ];

  const upcomingMentorships = [
    {
      title: "Mentoria: Implementação de IA",
      mentor: "Dr. Ana Silva",
      date: "Hoje, 15:00",
      avatar: "/api/placeholder/40/40"
    },
    {
      title: "Workshop: Ética em IA",
      mentor: "Prof. Carlos Santos",
      date: "Amanhã, 10:00",
      avatar: "/api/placeholder/40/40"
    }
  ];

  const achievements = [
    { name: "Primeiro Curso", icon: "🏆", earned: true },
    { name: "Streak 7 dias", icon: "🔥", earned: true },
    { name: "Quiz Master", icon: "🧠", earned: true },
    { name: "Mentor Helper", icon: "💪", earned: false },
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
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Bem-vindo de volta, João!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="ai-gradient text-white border-0">
                  Streak: 12 dias 🔥
                </Badge>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Mentoria
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
                      Cursos Concluídos
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      +3 este mês
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Horas de Estudo
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">47h</div>
                    <p className="text-xs text-muted-foreground">
                      +8h esta semana
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      XP Total
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,840</div>
                    <p className="text-xs text-muted-foreground">
                      Nível 12 (160 para próximo)
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Ranking
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">#7</div>
                    <p className="text-xs text-muted-foreground">
                      Na sua empresa
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Continue Learning */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-blue-600" />
                        Continue Aprendendo
                      </CardTitle>
                      <CardDescription>
                        Continue de onde parou em seus cursos favoritos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentCourses.map((course, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="w-20 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {course.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{course.duration}</span>
                                <Badge variant="outline" className="text-xs">
                                  {course.category}
                                </Badge>
                              </div>
                              <Progress value={course.progress} className="mt-2 h-2" />
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {course.progress}%
                              </div>
                              <Button size="sm" variant="outline" className="mt-2">
                                Continuar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Learning Path Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-green-600" />
                        Trilha: IA para Desenvolvedores
                      </CardTitle>
                      <CardDescription>
                        Sua jornada personalizada em IA Generativa
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progresso Geral</span>
                          <span className="text-sm text-gray-500">7 de 12 módulos</span>
                        </div>
                        <Progress value={58} className="h-3" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Fundamentos</span>
                              <Badge className="bg-green-100 text-green-700">Concluído</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Prompt Engineering</span>
                              <Badge className="bg-blue-100 text-blue-700">Em andamento</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">APIs e Integrações</span>
                              <Badge variant="outline">Próximo</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Fine-tuning</span>
                              <Badge variant="outline">Bloqueado</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Projeto Final</span>
                              <Badge variant="outline">Bloqueado</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Certificação</span>
                              <Badge variant="outline">Bloqueado</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  {/* Upcoming Mentorships */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                        Próximas Mentorias
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingMentorships.map((mentorship, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={mentorship.avatar} />
                              <AvatarFallback>{mentorship.mentor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">
                                {mentorship.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {mentorship.mentor}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {mentorship.date}
                              </p>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full" size="sm">
                          Ver Todas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-yellow-600" />
                        Conquistas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg text-center transition-all ${
                              achievement.earned
                                ? 'bg-yellow-50 border border-yellow-200'
                                : 'bg-gray-50 border border-gray-200 opacity-50'
                            }`}
                          >
                            <div className="text-2xl mb-1">{achievement.icon}</div>
                            <div className="text-xs font-medium">{achievement.name}</div>
                          </div>
                        ))}
                      </div>
                      <Link to="/achievements">
                        <Button variant="outline" className="w-full mt-4" size="sm">
                          Ver Todas Conquistas
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Fazer Pergunta na Comunidade
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Explorar Novos Cursos
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Ver Leaderboard
                      </Button>
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

export default Dashboard;
