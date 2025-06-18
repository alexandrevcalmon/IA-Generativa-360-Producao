
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompanyMentorships } from "@/hooks/useCompanyMentorships";
import { Calendar, Clock, Users, Video, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CompanyMentorships = () => {
  const { data: mentorships = [], isLoading, error } = useCompanyMentorships();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'live':
        return 'Ao Vivo';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentorias da Empresa</h1>
              <p className="text-gray-600">Carregando mentorias...</p>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 bg-gray-50">
          <div className="animate-pulse grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Mentorias da Empresa</h1>
              <p className="text-gray-600">Erro ao carregar mentorias</p>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500 mb-4">Erro ao carregar mentorias</p>
              <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const upcomingMentorships = mentorships.filter(m => 
    new Date(m.scheduled_at) > new Date() && m.status === 'scheduled'
  );

  const pastMentorships = mentorships.filter(m => 
    new Date(m.scheduled_at) <= new Date() || m.status === 'completed'
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentorias da Empresa</h1>
              <p className="text-gray-600">
                Acompanhe as sessões de mentoria disponíveis para seus colaboradores
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Próximas Mentorias */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Próximas Mentorias ({upcomingMentorships.length})
            </h2>
            
            {upcomingMentorships.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMentorships.map((mentorship) => (
                  <Card key={mentorship.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{mentorship.title}</CardTitle>
                        <Badge className={getStatusColor(mentorship.status)}>
                          {getStatusText(mentorship.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {mentorship.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {mentorship.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(mentorship.scheduled_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(new Date(mentorship.scheduled_at), "HH:mm", { locale: ptBR })} ({mentorship.duration_minutes} min)
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {mentorship.participants_count} / {mentorship.max_participants} participantes
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {mentorship.meet_url && (
                          <Button 
                            size="sm" 
                            onClick={() => window.open(mentorship.meet_url, '_blank')}
                            className="flex-1"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Acessar
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => console.log('Ver detalhes:', mentorship.id)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma mentoria agendada
                  </h3>
                  <p className="text-gray-600">
                    Novas mentorias aparecerão aqui quando forem agendadas
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Mentorias Passadas */}
          {pastMentorships.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                Mentorias Anteriores ({pastMentorships.length})
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastMentorships.map((mentorship) => (
                  <Card key={mentorship.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{mentorship.title}</CardTitle>
                        <Badge className={getStatusColor(mentorship.status)}>
                          {getStatusText(mentorship.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {mentorship.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {mentorship.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(mentorship.scheduled_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(new Date(mentorship.scheduled_at), "HH:mm", { locale: ptBR })} ({mentorship.duration_minutes} min)
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {mentorship.participants_count} participaram
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Estado vazio */}
          {mentorships.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma mentoria encontrada
                </h3>
                <p className="text-gray-600">
                  As mentorias disponíveis para sua empresa aparecerão aqui
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyMentorships;
