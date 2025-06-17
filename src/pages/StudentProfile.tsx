
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Settings,
  Bell,
  Shield,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Save,
  Award,
  BookOpen,
  Trophy
} from "lucide-react";
import { useState } from "react";
import { useAuth } from '@/hooks/useAuth';

const StudentProfile = () => {
  const { companyUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const profileStats = [
    {
      label: "Cursos Concluídos",
      value: "12",
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      label: "Horas de Estudo",
      value: "156h",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      label: "Certificações",
      value: "3",
      icon: Award,
      color: "text-green-600"
    },
    {
      label: "Conquistas",
      value: "8",
      icon: Trophy,
      color: "text-yellow-600"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Primeiro Curso Concluído",
      description: "Parabéns por concluir seu primeiro curso!",
      date: "15 Mai 2024",
      icon: "🎓"
    },
    {
      id: 2,
      title: "Streak de 7 Dias",
      description: "Estudou por 7 dias consecutivos",
      date: "22 Mai 2024",
      icon: "🔥"
    },
    {
      id: 3,
      title: "Expert em Prompts",
      description: "Completou 50 exercícios de prompt engineering",
      date: "01 Jun 2024",
      icon: "⚡"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Concluiu o curso",
      target: "IA Generativa para Desenvolvedores",
      time: "2 horas atrás"
    },
    {
      id: 2,
      action: "Participou da discussão",
      target: "Melhores práticas de Prompt Engineering",
      time: "1 dia atrás"
    },
    {
      id: 3,
      action: "Conquistou o badge",
      target: "Expert em Prompts",
      time: "2 dias atrás"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/api/placeholder/96/96" />
                    <AvatarFallback className="text-lg">
                      {companyUserData?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {companyUserData?.name || 'Nome do Usuário'}
                  </h2>
                  <p className="text-gray-600">{companyUserData?.email || 'email@exemplo.com'}</p>
                  {companyUserData?.companies && (
                    <p className="text-sm text-blue-600 mt-1">
                      {companyUserData.companies.name}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <Badge variant="secondary">Estudante</Badge>
                    <Badge variant="outline">IA Generativa</Badge>
                    <Badge variant="outline">Desenvolvedor</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                  {profileStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`mx-auto w-8 h-8 ${stat.color} mb-2`}>
                        <stat.icon className="w-full h-full" />
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
              <TabsTrigger value="academic">Acadêmico</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        defaultValue={companyUserData?.name || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={companyUserData?.email || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="(11) 99999-9999"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localização</Label>
                      <Input 
                        id="location" 
                        placeholder="São Paulo, SP"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Sobre mim</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Conte um pouco sobre você, seus interesses e objetivos..."
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Progresso Acadêmico
                  </CardTitle>
                  <CardDescription>
                    Seu histórico de aprendizagem e certificações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Trilhas de Aprendizagem</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">IA para Desenvolvedores</p>
                            <p className="text-sm text-gray-600">Em andamento - 7/12 módulos</p>
                          </div>
                          <Badge variant="secondary">58% concluído</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Fundamentos de IA Generativa</p>
                            <p className="text-sm text-gray-600">Concluído</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">100% concluído</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Certificações</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center mb-2">
                            <Award className="h-5 w-5 text-yellow-500 mr-2" />
                            <p className="font-medium">Certificado em IA Generativa</p>
                          </div>
                          <p className="text-sm text-gray-600">Emitido em: 15 Mai 2024</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Ver Certificado
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Conquistas e Badges
                  </CardTitle>
                  <CardDescription>
                    Suas conquistas e marcos de aprendizagem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 border rounded-lg text-center">
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h4 className="font-medium mb-1">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>
                    Suas últimas atividades na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span>{' '}
                            <span className="text-blue-600">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notificações
                    </CardTitle>
                    <CardDescription>
                      Configure suas preferências de notificação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novos cursos</p>
                        <p className="text-sm text-gray-600">Notificar sobre novos cursos disponíveis</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Progresso</p>
                        <p className="text-sm text-gray-600">Lembretes de estudo e marcos</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Comunidade</p>
                        <p className="text-sm text-gray-600">Atividades da comunidade</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Privacidade
                    </CardTitle>
                    <CardDescription>
                      Gerencie suas configurações de privacidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Perfil público</p>
                        <p className="text-sm text-gray-600">Permitir que outros vejam seu perfil</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Progresso visível</p>
                        <p className="text-sm text-gray-600">Mostrar progresso nos cursos</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Atividade na comunidade</p>
                        <p className="text-sm text-gray-600">Mostrar participação em discussões</p>
                      </div>
                      <Switch />
                    </div>
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

export default StudentProfile;
