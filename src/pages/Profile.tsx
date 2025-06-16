
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Settings,
  Bell,
  Shield,
  Download,
  Upload,
  Camera,
  Zap,
  Trophy,
  Target,
  BookOpen
} from "lucide-react";

const Profile = () => {
  const userStats = {
    totalXP: 2840,
    level: 12,
    coursesCompleted: 12,
    hoursStudied: 47.5,
    streakDays: 12,
    rank: 7,
    joinDate: "Janeiro 2024"
  };

  const recentAchievements = [
    {
      name: "Streak Master",
      description: "Manteve 7 dias consecutivos de estudo",
      earnedDate: "3 dias atrás",
      icon: "🔥",
      rarity: "Comum"
    },
    {
      name: "Quiz Expert",
      description: "Acertou 90% em 5 quizzes seguidos",
      earnedDate: "1 semana atrás",
      icon: "🧠",
      rarity: "Raro"
    },
    {
      name: "First Steps",
      description: "Completou o primeiro curso",
      earnedDate: "2 semanas atrás",
      icon: "🏆",
      rarity: "Comum"
    }
  ];

  const completedCourses = [
    {
      title: "Ética em IA e Responsabilidade",
      completedDate: "1 semana atrás",
      certificate: true,
      rating: 5,
      category: "Ética"
    },
    {
      title: "Fundamentos de IA Generativa",
      completedDate: "2 semanas atrás",
      certificate: true,
      rating: 5,
      category: "IA Generativa"
    },
    {
      title: "Introdução ao ChatGPT",
      completedDate: "3 semanas atrás",
      certificate: true,
      rating: 4,
      category: "Ferramentas"
    }
  ];

  const notificationSettings = [
    {
      title: "Novos cursos disponíveis",
      description: "Receba notificações sobre novos conteúdos",
      enabled: true
    },
    {
      title: "Lembretes de estudo",
      description: "Nudges para manter sua sequência de aprendizado",
      enabled: true
    },
    {
      title: "Respostas na comunidade",
      description: "Quando alguém responder suas perguntas",
      enabled: true
    },
    {
      title: "Mentorias agendadas",
      description: "Lembretes de sessões de mentoria",
      enabled: true
    },
    {
      title: "Conquistas desbloqueadas",
      description: "Notificações de novos badges e certificados",
      enabled: false
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
                  <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                  <p className="text-gray-600">Gerencie suas informações e preferências</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
                <Button className="ai-gradient text-white" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Profile Header Card */}
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 ai-gradient opacity-10" />
                <CardContent className="relative p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                    {/* Avatar Section */}
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src="/api/placeholder/128/128" />
                        <AvatarFallback className="text-2xl font-bold ai-gradient text-white">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 ai-gradient text-white"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            João Desenvolver
                          </h2>
                          <p className="text-lg text-gray-600 mb-3">
                            Desenvolvedor Full Stack
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="ai-gradient text-white border-0">
                              Nível {userStats.level}
                            </Badge>
                            <Badge variant="outline">
                              #{userStats.rank} na Empresa
                            </Badge>
                            <Badge variant="outline">
                              Membro desde {userStats.joinDate}
                            </Badge>
                          </div>
                        </div>

                        {/* XP Progress */}
                        <div className="mt-4 lg:mt-0 lg:text-right">
                          <div className="mb-2">
                            <span className="text-2xl font-bold text-blue-600">
                              {userStats.totalXP.toLocaleString()}
                            </span>
                            <span className="text-gray-600 ml-2">XP Total</span>
                          </div>
                          <div className="w-full lg:w-64">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Nível {userStats.level}</span>
                              <span>Nível {userStats.level + 1}</span>
                            </div>
                            <Progress value={75} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              160 XP para próximo nível
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            {userStats.coursesCompleted}
                          </div>
                          <div className="text-sm text-gray-600">Cursos</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            {userStats.hoursStudied}h
                          </div>
                          <div className="text-sm text-gray-600">Horas</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            {userStats.streakDays}
                          </div>
                          <div className="text-sm text-gray-600">Dias 🔥</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            #{userStats.rank}
                          </div>
                          <div className="text-sm text-gray-600">Ranking</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Tabs */}
              <Tabs defaultValue="info" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="achievements">Conquistas</TabsTrigger>
                  <TabsTrigger value="courses">Certificados</TabsTrigger>
                  <TabsTrigger value="notifications">Notificações</TabsTrigger>
                  <TabsTrigger value="privacy">Privacidade</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Informações Pessoais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Nome</Label>
                            <Input id="firstName" defaultValue="João" />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input id="lastName" defaultValue="Desenvolver" />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              id="email" 
                              defaultValue="joao@empresa.com" 
                              className="pl-10"
                              disabled
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              id="phone" 
                              defaultValue="+55 11 99999-9999" 
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Localização</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              id="location" 
                              defaultValue="São Paulo, SP" 
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea 
                            id="bio" 
                            placeholder="Conte um pouco sobre você..."
                            defaultValue="Desenvolvedor Full Stack apaixonado por tecnologia e sempre em busca de aprender novas ferramentas e metodologias."
                          />
                        </div>
                        
                        <Button className="ai-gradient text-white">
                          Salvar Alterações
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações Profissionais</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="company">Empresa</Label>
                          <Input id="company" defaultValue="Tech Innovation Corp" disabled />
                        </div>
                        
                        <div>
                          <Label htmlFor="role">Cargo</Label>
                          <Input id="role" defaultValue="Desenvolvedor Full Stack" />
                        </div>
                        
                        <div>
                          <Label htmlFor="department">Departamento</Label>
                          <Input id="department" defaultValue="Engenharia de Software" />
                        </div>
                        
                        <div>
                          <Label htmlFor="experience">Experiência</Label>
                          <Input id="experience" defaultValue="5 anos" />
                        </div>
                        
                        <div>
                          <Label htmlFor="skills">Habilidades</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">React</Badge>
                            <Badge variant="outline">Node.js</Badge>
                            <Badge variant="outline">Python</Badge>
                            <Badge variant="outline">AI/ML</Badge>
                            <Badge variant="outline">TypeScript</Badge>
                            <Button variant="ghost" size="sm" className="h-6">
                              + Adicionar
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="interests">Interesses de Aprendizagem</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className="ai-gradient text-white border-0">IA Generativa</Badge>
                            <Badge className="ai-gradient text-white border-0">Machine Learning</Badge>
                            <Badge variant="outline">DevOps</Badge>
                            <Badge variant="outline">Cloud Computing</Badge>
                            <Button variant="ghost" size="sm" className="h-6">
                              + Adicionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentAchievements.map((achievement, index) => (
                      <Card key={index} className="border-2 border-yellow-200 bg-yellow-50">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-3">{achievement.icon}</div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                achievement.rarity === 'Raro' ? 'border-purple-300 text-purple-700' : 
                                'border-gray-300 text-gray-700'
                              }`}
                            >
                              {achievement.rarity}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {achievement.earnedDate}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progresso das Conquistas</CardTitle>
                      <CardDescription>
                        Veja quais conquistas você pode desbloquear
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Mais conquistas em breve
                        </h3>
                        <p className="text-gray-600">
                          Continue aprendendo para desbloquear novos badges
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="courses" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Certificados Conquistados
                      </CardTitle>
                      <CardDescription>
                        Seus certificados digitais verificáveis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {completedCourses.map((course, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center">
                                <Award className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {course.title}
                                </h4>
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                  <span>Concluído em {course.completedDate}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {course.category}
                                  </Badge>
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span key={i} className={`text-yellow-400 ${i < course.rating ? '★' : '☆'}`}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Baixar
                              </Button>
                              <Button variant="outline" size="sm">
                                Verificar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        Preferências de Notificação
                      </CardTitle>
                      <CardDescription>
                        Configure como você quer receber notificações
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {notificationSettings.map((setting, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="font-medium">{setting.title}</div>
                              <div className="text-sm text-gray-600">
                                {setting.description}
                              </div>
                            </div>
                            <Switch defaultChecked={setting.enabled} />
                          </div>
                        ))}
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h4 className="font-medium">Canais de Notificação</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>Email</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>SMS</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>WhatsApp</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Slack</span>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Privacidade e Segurança
                      </CardTitle>
                      <CardDescription>
                        Gerencie seus dados e configurações de privacidade
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Perfil Público</div>
                            <div className="text-sm text-gray-600">
                              Permitir que outros usuários vejam seu perfil
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Mostrar no Leaderboard</div>
                            <div className="text-sm text-gray-600">
                              Aparecer nos rankings públicos
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Analytics de Aprendizagem</div>
                            <div className="text-sm text-gray-600">
                              Permitir coleta de dados para melhorar a experiência
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Controle de Dados</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar Dados
                          </Button>
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Importar Dados
                          </Button>
                        </div>
                        
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <h5 className="font-medium text-red-900 mb-2">
                            Zona de Perigo
                          </h5>
                          <p className="text-sm text-red-700 mb-3">
                            Estas ações são irreversíveis. Proceda com cuidado.
                          </p>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                              Limpar Histórico de Aprendizagem
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                              Excluir Conta
                            </Button>
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

export default Profile;
