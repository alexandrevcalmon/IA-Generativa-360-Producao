
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
  TrendingUp,
  Loader2 // Import Loader2 for delete loading state
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
import { useCompaniesWithPlans } from "../../hooks/useCompaniesWithPlans"; // Corrected path
import { useDeleteCompany } from "@/hooks/useCompanies"; // Import useDeleteCompany
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

const ProducerCompanies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: companies = [], isLoading, error } = useCompaniesWithPlans();
  const deleteCompanyMutation = useDeleteCompany();

  const getPlanBadgeColor = (planName?: string | null) => {
    // Adjusted to handle plan object and potential null/undefined
    switch (planName?.toLowerCase()) {
      case "premium":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "business":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "basic":
      case "starter": // Assuming 'starter' is a possible plan name
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200"; // For undefined or other plans
    }
  };

  const getPlanIcon = (planName?: string | null) => {
    // Adjusted to handle plan object and potential null/undefined
    switch (planName?.toLowerCase()) {
      case "premium":
        return <Crown className="h-3 w-3" />;
      case "business":
        return <Star className="h-3 w-3" />;
      default:
        return null; // No icon for basic or other plans
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats from fetched data
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.is_active).length;
  const totalCollaborators = companies.reduce((sum, c) => sum + (c.current_students || 0), 0);


  if (isLoading) {
    return (
      <>
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            <header className="border-b bg-white px-6 py-4">
              {/* Header content can remain similar or also have skeletons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciar Empresas</h1>
                    <p className="text-gray-600">Carregando empresas...</p>
                  </div>
                </div>
                <Button disabled className="bg-gradient-to-r from-calmon-500 to-calmon-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-6 bg-gray-50 space-y-6">
              {/* Skeleton for search and stats */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Skeleton className="h-10 w-full lg:col-span-1" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              {/* Skeleton for company list */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full items-center justify-center">
            <p className="text-red-500 text-lg">Erro ao carregar as empresas.</p>
            <p>{(error as Error)?.message || "Tente novamente mais tarde."}</p>
          </div>
        </main>
      </>
    );
  }

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
                        <p className="text-2xl font-bold">{totalCompanies}</p>
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
                          {activeCompanies}
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
                          {totalCollaborators}
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
                          {company.logo_url ? (
                            <img src={company.logo_url} alt={`${company.name} logo`} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-calmon-500 to-calmon-700 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{company.name}</h3>
                              {company.subscription_plan && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPlanBadgeColor(company.subscription_plan.name)}`}
                                >
                                  {getPlanIcon(company.subscription_plan.name)}
                                  <span className="ml-1 capitalize">{company.subscription_plan.name}</span>
                                </Badge>
                              )}
                              {!company.is_active && (
                                <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                                  Inativa
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>{company.current_students || 0}/{company.max_students || 'N/A'} colaboradores</span>
                              <span>•</span>
                              <span>Desde {new Date(company.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium">
                              {company.max_students && company.max_students > 0
                                ? `${Math.round(((company.current_students || 0) / company.max_students) * 100)}% ocupação`
                                : "N/A"}
                            </div>
                            {company.max_students && company.max_students > 0 && (
                              <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                  className="h-full bg-gradient-to-r from-calmon-500 to-calmon-700 rounded-full"
                                  style={{ width: `${((company.current_students || 0) / company.max_students) * 100}%` }}
                                />
                              </div>
                            )}
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
                              <DropdownMenuItem
                                onClick={() => {
                                  // TODO: Integrate with EditCompanyDialog if that's how editing is triggered from here
                                  // For now, this might navigate or open a modal.
                                  // This item should likely be removed if editing is only from details page.
                                  alert(`Editar ${company.name} - Funcionalidade a ser conectada ao EditCompanyDialog ou removida se não aplicável aqui.`);
                                }}
                              >
                                <Edit className="h-3 w-3 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                                onClick={async () => {
                                  if (window.confirm(`Tem certeza que deseja excluir a empresa "${company.name}"? Esta ação não pode ser desfeita.`)) {
                                    try {
                                      await deleteCompanyMutation.mutateAsync(company.id);
                                    } catch (err) {
                                      // Error is handled by the hook's onError, but specific UI feedback can be added here
                                      console.error("Falha ao excluir empresa:", err);
                                    }
                                  }
                                }}
                                disabled={deleteCompanyMutation.isPending}
                              >
                                {deleteCompanyMutation.isPending && deleteCompanyMutation.variables === company.id ? (
                                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-2" />
                                )}
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
