
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompanyMentorships } from "@/hooks/useCompanyMentorships";
import { useCompanyData } from "@/hooks/useCompanyData";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  CalendarDays,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

const CompanyMentorships = () => {
  const { data: mentorships, isLoading, error, refetch } = useCompanyMentorships();
  const { data: companyData } = useCompanyData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentorias</h1>
              <p className="text-gray-600">Carregando sessões de mentoria...</p>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 bg-gray-50">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentorias</h1>
              <p className="text-gray-600">Erro ao carregar dados</p>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Erro ao carregar sessões de mentoria</h3>
              <p className="text-gray-600 mb-4">
                Ocorreu um erro ao carregar as sessões de mentoria. Tente novamente.
              </p>
              <div className="space-x-2">
                <Button onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? 'Atualizando...' : 'Tentar Novamente'}
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Recarregar Página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const upcomingMentorships = mentorships?.filter(m => 
    new Date(m.scheduled_at) > new Date() && m.status === 'scheduled'
  ) || [];

  const pastMentorships = mentorships?.filter(m => 
    new Date(m.scheduled_at) <= new Date() || m.status === 'completed'
  ) || [];

  const getStatusBadge = (status: string, scheduledAt: string) => {
    const now = new Date();
    const sessionDate = new Date(scheduledAt);
    
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-700">Concluída</Badge>;
    }
    
    if (status === 'cancelled') {
      return <Badge variant="destructive">Cancelada</Badge>;
    }
    
    if (sessionDate > now) {
      return <Badge className="bg-blue-100 text-blue-700">Agendada</Badge>;
    }
    
    return <Badge className="bg-yellow-100 text-yellow-700">Em andamento</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentorias</h1>
              <p className="text-gray-600">
                Acompanhe as sessões de mentoria da {companyData?.name || 'empresa'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Solicitar Mentoria
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{upcomingMentorships.length}</p>
                    <p className="text-sm text-gray-600">Próximas Sessões</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{pastMentorships.length}</p>
                    <p className="text-sm text-gray-600">Concluídas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {mentorships?.reduce((sum, m) => sum + m.participants_count, 0) || 0}
                    </p>
                    <p className="text-sm text-gray-600">Participantes Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Mentorships */}
          {upcomingMentorships.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Próximas Mentorias
              </h2>
              <div className="grid gap-4">
                {upcomingMentorships.map((mentorship) => (
                  <Card key={mentorship.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {mentorship.title}
                            </h3>
                            {getStatusBadge(mentorship.status, mentorship.scheduled_at)}
                          </div>
                          
                          {mentorship.description && (
                            <p className="text-gray-600 mb-3">{mentorship.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDateTime(mentorship.scheduled_at)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{mentorship.duration_minutes} minutos</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {mentorship.participants_count}/{mentorship.max_participants} participantes
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {mentorship.meet_url && (
                            <Button 
                              size="sm" 
                              className="flex items-center space-x-1"
                              onClick={() => window.open(mentorship.meet_url, '_blank')}
                            >
                              <Video className="h-4 w-4" />
                              <span>Entrar na Sessão</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Mentorships */}
          {pastMentorships.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Mentorias Anteriores
              </h2>
              <div className="grid gap-4">
                {pastMentorships.map((mentorship) => (
                  <Card key={mentorship.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {mentorship.title}
                            </h3>
                            {getStatusBadge(mentorship.status, mentorship.scheduled_at)}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDateTime(mentorship.scheduled_at)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{mentorship.participants_count} participantes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!mentorships || mentorships.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma mentoria agendada</h3>
                <p className="text-gray-600 mb-4">
                  Solicite uma sessão de mentoria para desenvolvimento da sua equipe
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Solicitar Primeira Mentoria
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyMentorships;
