
import { useState } from "react";
import { useCollaboratorAnalytics } from "@/hooks/useCollaboratorAnalytics";
import { CollaboratorAnalyticsSummary } from "@/components/producer/CollaboratorAnalyticsSummary";
import { CollaboratorStatsCard } from "@/components/producer/CollaboratorStatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Filter } from "lucide-react";
import { toast } from "sonner";

const ProducerCollaboratorsAnalytics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const { data: analytics = [], isLoading, error, refetch } = useCollaboratorAnalytics();

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Dados atualizados com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    }
  };

  const filteredAndSortedAnalytics = analytics
    .filter(stat => {
      const matchesSearch = stat.collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stat.collaborator.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "active" && stat.collaborator.is_active) ||
                           (filterStatus === "inactive" && !stat.collaborator.is_active);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.collaborator.name.localeCompare(b.collaborator.name);
        case "lessons_completed":
          return b.lessons_completed - a.lessons_completed;
        case "total_watch_time_minutes":
          return b.total_watch_time_minutes - a.total_watch_time_minutes;
        case "last_login_at":
          const aDate = a.last_login_at ? new Date(a.last_login_at) : new Date(0);
          const bDate = b.last_login_at ? new Date(b.last_login_at) : new Date(0);
          return bDate.getTime() - aDate.getTime();
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Analytics de Colaboradores</h1>
          <p className="text-gray-600">Acompanhe o desempenho e engajamento dos colaboradores</p>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-red-500 text-lg">Erro ao carregar analytics</p>
        <p className="text-gray-600">{(error as Error)?.message}</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics de Colaboradores</h1>
            <p className="text-gray-600">Acompanhe o desempenho e engajamento dos colaboradores</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Summary Cards */}
          <CollaboratorAnalyticsSummary stats={analytics} />

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros e Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated_at">Última atualização</SelectItem>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="lessons_completed">Lições completadas</SelectItem>
                    <SelectItem value="total_watch_time_minutes">Tempo de estudo</SelectItem>
                    <SelectItem value="last_login_at">Último acesso</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Collaborator Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedAnalytics.map((stat) => (
              <CollaboratorStatsCard key={stat.id} stats={stat} />
            ))}
          </div>

          {filteredAndSortedAnalytics.length === 0 && analytics.length > 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum colaborador encontrado com os filtros aplicados</p>
              </CardContent>
            </Card>
          )}

          {analytics.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum dado de analytics disponível ainda</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducerCollaboratorsAnalytics;
