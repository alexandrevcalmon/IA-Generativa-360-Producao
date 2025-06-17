
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Plus,
  Search,
  Users,
  Crown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateCompanyDialog } from "@/components/CreateCompanyDialog";

const ProducerCompanies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data for companies
  const companies = [
    {
      id: "1",
      name: "TechCorp Solutions",
      logo_url: "/api/placeholder/80/80",
      subscription_plan: "premium",
      current_students: 142,
      max_students: 200,
      is_active: true,
      created_at: "2024-01-15",
      completion_rate: 85
    },
    {
      id: "2",
      name: "Inovação Digital Ltda",
      logo_url: "/api/placeholder/80/80",
      subscription_plan: "business",
      current_students: 89,
      max_students: 150,
      is_active: true,
      created_at: "2024-02-08",
      completion_rate: 92
    },
    {
      id: "3",
      name: "StartupXYZ",
      logo_url: "/api/placeholder/80/80",
      subscription_plan: "basic",
      current_students: 23,
      max_students: 50,
      is_active: true,
      created_at: "2024-03-12",
      completion_rate: 76
    },
    {
      id: "4",
      name: "Empresa ABC",
      logo_url: "/api/placeholder/80/80",
      subscription_plan: "premium",
      current_students: 0,
      max_students: 200,
      is_active: false,
      created_at: "2024-03-20",
      completion_rate: 0
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

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <h1 className="text-2xl font-bold text-gray-900">Gerenciar Empresas</h1>
                  <p className="text-gray-600">Gerencie suas empresas clientes e seus colaboradores</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="space-y-6">
              {/* Search and Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar empresas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Card className="hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Empresas</p>
                        <p className="text-2xl font-bold">{companies.length}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-calmon-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Empresas Ativas</p>
                        <p className="text-2xl font-bold text-green-600">
                          {companies.filter(c => c.is_active).length}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Colaboradores</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {companies.reduce((sum, c) => sum + c.current_students, 0)}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Companies List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-calmon-600" />
                    Empresas Cadastradas
                  </CardTitle>
                  <CardDescription>
                    Lista de todas as empresas clientes e seus status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCompanies.map((company) => (
                      <div 
                        key={company.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-calmon-500 to-calmon-700 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{company.name}</h3>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPlanBadgeColor(company.subscription_plan)}`}
                              >
                                {getPlanIcon(company.subscription_plan)}
                                <span className="ml-1 capitalize">{company.subscription_plan}</span>
                              </Badge>
                              {!company.is_active && (
                                <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                                  Inativa
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>{company.current_students}/{company.max_students} colaboradores</span>
                              <span>•</span>
                              <span>Taxa de conclusão: {company.completion_rate}%</span>
                              <span>•</span>
                              <span>Desde {new Date(company.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium">
                              {Math.round((company.current_students / company.max_students) * 100)}% ocupação
                            </div>
                            <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                              <div 
                                className="h-full bg-gradient-to-r from-calmon-500 to-calmon-700 rounded-full"
                                style={{ width: `${(company.current_students / company.max_students) * 100}%` }}
                              />
                            </div>
                          </div>

                          <Link to={`/producer/companies/${company.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver Detalhes
                            </Button>
                          </Link>

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
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <CreateCompanyDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  );
};

export default ProducerCompanies;
