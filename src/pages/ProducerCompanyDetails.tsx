
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  ArrowLeft,
  Users,
  Plus,
  Search,
  Crown,
  Star,
  Edit,
  Trash2,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  UserPlus,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { AddCollaboratorDialog } from "@/components/AddCollaboratorDialog";

const ProducerCompanyDetails = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState(false);

  // Mock company data
  const company = {
    id: "1",
    name: "TechCorp Solutions",
    logo_url: "/api/placeholder/80/80",
    subscription_plan: "premium",
    current_students: 142,
    max_students: 200,
    is_active: true,
    created_at: "2024-01-15",
    completion_rate: 85
  };

  // Mock collaborators data
  const collaborators = [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@techcorp.com",
      role: "student",
      avatar_url: "/api/placeholder/40/40",
      enrolled_courses: 3,
      completed_courses: 2,
      progress: 78,
      last_activity: "2024-12-16",
      created_at: "2024-01-20"
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@techcorp.com",
      role: "student",
      avatar_url: "/api/placeholder/40/40",
      enrolled_courses: 5,
      completed_courses: 4,
      progress: 92,
      last_activity: "2024-12-15",
      created_at: "2024-02-10"
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro.costa@techcorp.com",
      role: "student",
      avatar_url: "/api/placeholder/40/40",
      enrolled_courses: 2,
      completed_courses: 1,
      progress: 45,
      last_activity: "2024-12-10",
      created_at: "2024-03-05"
    }
  ];

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "premium":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "business":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "basic":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Crown className="h-3 w-3" />;
      case "business":
        return <Star className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <SidebarTrigger />
                  <Link to="/producer/companies">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Voltar
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-calmon-500 to-calmon-700 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPlanBadgeColor(company.subscription_plan)}`}
                      >
                        {getPlanIcon(company.subscription_plan)}
                        <span className="ml-1 capitalize">{company.subscription_plan}</span>
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      {company.current_students}/{company.max_students} colaboradores • 
                      Desde {new Date(company.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Empresa
                </Button>
                <Button 
                  onClick={() => setIsAddCollaboratorOpen(true)}
                  className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Colaborador
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white border">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="collaborators">Colaboradores</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Colaboradores Ativos</p>
                          <p className="text-2xl font-bold">{company.current_students}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                          <p className="text-2xl font-bold text-green-600">{company.completion_rate}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Ocupação</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {Math.round((company.current_students / company.max_students) * 100)}%
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Cursos Ativos</p>
                          <p className="text-2xl font-bold text-orange-600">8</p>
                        </div>
                        <Building2 className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progresso dos Colaboradores</CardTitle>
                    <CardDescription>
                      Acompanhe o progresso geral dos colaboradores nos cursos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Gráfico de progresso será implementado aqui</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaborators" className="space-y-6">
                {/* Search and Actions */}
                <div className="flex items-center justify-between">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar colaboradores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={() => setIsAddCollaboratorOpen(true)}
                    className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Colaborador
                  </Button>
                </div>

                {/* Collaborators List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Colaboradores</CardTitle>
                    <CardDescription>
                      Gerencie os colaboradores da empresa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredCollaborators.map((collaborator) => (
                        <div 
                          key={collaborator.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-calmon-500 to-calmon-700 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {collaborator.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{collaborator.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {collaborator.email}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Última atividade: {new Date(collaborator.last_activity).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-sm font-medium">{collaborator.enrolled_courses}</div>
                              <div className="text-xs text-gray-500">Cursos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{collaborator.completed_courses}</div>
                              <div className="text-xs text-gray-500">Concluídos</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center space-x-2">
                                <div className="w-12 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className={`h-full rounded-full ${getProgressColor(collaborator.progress)}`}
                                    style={{ width: `${collaborator.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{collaborator.progress}%</span>
                              </div>
                              <div className="text-xs text-gray-500">Progresso</div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuItem>
                                  <Edit className="h-3 w-3 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Detalhados</CardTitle>
                    <CardDescription>
                      Relatórios e métricas detalhadas da empresa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Analytics detalhados serão implementados aqui</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <AddCollaboratorDialog 
        isOpen={isAddCollaboratorOpen}
        onClose={() => setIsAddCollaboratorOpen(false)}
        companyId={id || ""}
      />
    </>
  );
};

export default ProducerCompanyDetails;
