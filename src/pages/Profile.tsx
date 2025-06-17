
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
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
  const { user, userRole } = useAuth();
  const { data: courses = [] } = useCourses();

  // Calculate real statistics from actual data
  const publishedCourses = courses.filter(course => course.is_published);
  const totalCourses = courses.length;

  // Real user stats based on role
  const userStats = {
    totalCourses: userRole === 'producer' ? totalCourses : 0,
    publishedCourses: userRole === 'producer' ? publishedCourses.length : 0,
    completedCourses: userRole === 'student' ? 0 : undefined, // Will be implemented when we have enrollment data
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Data não disponível'
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.slice(0, 2).toUpperCase();
    }
    return 'US';
  };

  // Get display name from email
  const getDisplayName = () => {
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return 'Usuário';
  };

  // Role display mapping
  const getRoleDisplay = () => {
    switch (userRole) {
      case 'producer':
        return 'Produtor de Conteúdo';
      case 'company':
        return 'Empresa';
      case 'student':
        return 'Estudante';
      default:
        return 'Usuário';
    }
  };

  const notificationSettings = [
    {
      title: "Novos cursos disponíveis",
      description: "Receba notificações sobre novos conteúdos",
      enabled: true
    },
    {
      title: "Atualizações da plataforma",
      description: "Notificações sobre melhorias e novidades",
      enabled: true
    },
    {
      title: "Relatórios de atividade",
      description: userRole === 'producer' ? "Relatórios sobre seus cursos" : "Relatórios de progresso nos estudos",
      enabled: false
    },
    {
      title: "Mensagens do sistema",
      description: "Comunicações importantes da plataforma",
      enabled: true
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
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
                  <Button variant="outline" size="sm" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button className="ai-gradient text-white" size="sm" disabled>
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
                          <AvatarImage src="" />
                          <AvatarFallback className="text-2xl font-bold ai-gradient text-white">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          size="sm" 
                          className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 ai-gradient text-white"
                          disabled
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                              {getDisplayName()}
                            </h2>
                            <p className="text-lg text-gray-600 mb-3">
                              {getRoleDisplay()}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="ai-gradient text-white border-0">
                                {getRoleDisplay()}
                              </Badge>
                              <Badge variant="outline">
                                Membro desde {userStats.joinDate}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {userRole === 'producer' ? (
                            <>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  {userStats.totalCourses}
                                </div>
                                <div className="text-sm text-gray-600">Cursos Criados</div>
                              </div>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  {userStats.publishedCourses}
                                </div>
                                <div className="text-sm text-gray-600">Publicados</div>
                              </div>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  0
                                </div>
                                <div className="text-sm text-gray-600">Empresas</div>
                              </div>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  0
                                </div>
                                <div className="text-sm text-gray-600">Estudantes</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  0
                                </div>
                                <div className="text-sm text-gray-600">Cursos</div>
                              </div>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  0h
                                </div>
                                <div className="text-sm text-gray-600">Horas</div>
                              </div>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  0
                                </div>
                                <div className="text-sm text-gray-600">Certificados</div>
                              </div>
                              <div className="text-center p-3 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                  0
                                </div>
                                <div className="text-sm text-gray-600">Conquistas</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Tabs */}
                <Tabs defaultValue="info" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Informações</TabsTrigger>
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
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input 
                                id="email" 
                                defaultValue={user?.email || ''} 
                                className="pl-10"
                                disabled
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="role">Tipo de Conta</Label>
                            <Input 
                              id="role" 
                              defaultValue={getRoleDisplay()} 
                              disabled
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="joinDate">Membro desde</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input 
                                id="joinDate" 
                                defaultValue={userStats.joinDate} 
                                className="pl-10"
                                disabled
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="bio">Biografia</Label>
                            <Textarea 
                              id="bio" 
                              placeholder="Conte um pouco sobre você..."
                              defaultValue=""
                            />
                          </div>
                          
                          <Button className="ai-gradient text-white" disabled>
                            Salvar Alterações
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Activity Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Resumo de Atividade</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {userRole === 'producer' ? (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cursos Criados</span>
                                <span className="font-semibold">{userStats.totalCourses}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cursos Publicados</span>
                                <span className="font-semibold">{userStats.publishedCourses}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Empresas Parceiras</span>
                                <span className="font-semibold">0</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Estudantes Alcançados</span>
                                <span className="font-semibold">0</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cursos Matriculados</span>
                                <span className="font-semibold">0</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cursos Concluídos</span>
                                <span className="font-semibold">0</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Horas de Estudo</span>
                                <span className="font-semibold">0h</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Certificados</span>
                                <span className="font-semibold">0</span>
                              </div>
                            </>
                          )}
                          
                          <div className="pt-4 mt-4 border-t">
                            <p className="text-sm text-gray-500 text-center">
                              {userRole === 'producer' 
                                ? 'Dados atualizados em tempo real conforme você cria conteúdo.'
                                : 'Seus dados de progresso aparecerão conforme você avança nos estudos.'
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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
                                <span>Notificações no navegador</span>
                                <Switch />
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
                                {userRole === 'producer' 
                                  ? 'Permitir que outros usuários vejam seu perfil de produtor'
                                  : 'Permitir que outros usuários vejam seu perfil'
                                }
                              </div>
                            </div>
                            <Switch defaultChecked={userRole === 'producer'} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Analytics de Uso</div>
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
                            <Button variant="outline" disabled>
                              <Download className="h-4 w-4 mr-2" />
                              Exportar Dados
                            </Button>
                            <Button variant="outline" disabled>
                              <Shield className="h-4 w-4 mr-2" />
                              Alterar Senha
                            </Button>
                          </div>
                          
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h5 className="font-medium text-red-900 mb-2">
                              Zona de Perigo
                            </h5>
                            <p className="text-sm text-red-700 mb-3">
                              Estas ações são irreversíveis. Proceda com cuidado.
                            </p>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-300" disabled>
                              Excluir Conta
                            </Button>
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
      </div>
    </SidebarProvider>
  );
};

export default Profile;
