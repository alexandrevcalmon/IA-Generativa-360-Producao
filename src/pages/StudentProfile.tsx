
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Settings,
  Bell,
  Shield,
  Camera,
  Calendar,
  Edit,
  Save,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';

const StudentProfile = () => {
  const { companyUserData, user, loading: authLoading, refreshUserRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('StudentProfile render:', {
      authLoading,
      user: user?.email,
      companyUserData,
      hasCompanyUserData: !!companyUserData
    });
  }, [authLoading, user, companyUserData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Manually refreshing user role...');
    try {
      await refreshUserRole();
    } catch (error) {
      console.error('Error refreshing user role:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getUserInitials = () => {
    if (companyUserData?.name) {
      return companyUserData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">Carregando informações...</p>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando seu perfil...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">Erro ao carregar perfil</p>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar as informações do usuário. Faça login novamente.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar'
              )}
            </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Show warning if no company data */}
          {!companyUserData && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Algumas informações do perfil podem não estar disponíveis. 
                Entre em contato com sua empresa se necessário.
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/api/placeholder/96/96" />
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                      {getUserInitials()}
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
                    {companyUserData?.name || user.email || 'Usuário'}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  {companyUserData?.companies && (
                    <p className="text-sm text-blue-600 mt-1">
                      {companyUserData.companies.name}
                    </p>
                  )}
                  {companyUserData?.position && (
                    <p className="text-sm text-gray-500 mt-1">
                      {companyUserData.position}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <Badge variant="secondary">Colaborador</Badge>
                    {companyUserData?.is_active !== undefined && (
                      companyUserData.is_active ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700">Inativo</Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
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
                    Suas informações pessoais e de contato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        value={companyUserData?.name || ''}
                        disabled={!isEditing}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user.email || ''}
                        disabled={!isEditing}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={companyUserData?.phone || ''}
                        disabled={!isEditing}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input 
                        id="position" 
                        value={companyUserData?.position || ''}
                        disabled={!isEditing}
                        readOnly
                      />
                    </div>
                  </div>
                  {companyUserData?.companies && (
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input 
                        id="company" 
                        value={companyUserData.companies.name}
                        disabled
                        readOnly
                      />
                    </div>
                  )}
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
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhuma atividade registrada
                    </h3>
                    <p className="text-gray-600">
                      Comece explorando os cursos disponíveis
                    </p>
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
