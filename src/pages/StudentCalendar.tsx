
import { useCalendarEvents, useUpcomingEvents } from '@/hooks/useCalendarEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Video, Users, GraduationCap, Building } from 'lucide-react';

const StudentCalendar = () => {
  const { data: allEvents, isLoading } = useCalendarEvents();
  const { data: upcomingEvents } = useUpcomingEvents(10);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'mentorship': return <Users className="h-4 w-4" />;
      case 'course_deadline': return <GraduationCap className="h-4 w-4" />;
      case 'company_meeting': return <Building className="h-4 w-4" />;
      case 'training': return <GraduationCap className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeText = (eventType: string) => {
    switch (eventType) {
      case 'mentorship': return 'Mentoria';
      case 'course_deadline': return 'Prazo do Curso';
      case 'company_meeting': return 'Reunião da Empresa';
      case 'training': return 'Treinamento';
      case 'holiday': return 'Feriado';
      default: return eventType;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">Calendário</h1>
            <p className="text-calmon-100">Carregando eventos...</p>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center bg-calmon-bg-gradient">
          <div className="text-lg text-calmon-700">Carregando eventos...</div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayEvents = allEvents?.filter(event => {
    const eventDate = new Date(event.start_date);
    return eventDate.toDateString() === today.toDateString();
  }) || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Calendário
            </h1>
            <p className="text-calmon-100">
              Acompanhe seus eventos e compromissos
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Calendar className="w-3 h-3 mr-1" />
            {allEvents?.length || 0} eventos
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-calmon-bg-gradient">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-calmon-800">
                  <Calendar className="h-5 w-5 text-calmon-600" />
                  Hoje ({today.toLocaleDateString('pt-BR')})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayEvents.length > 0 ? (
                    todayEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-calmon-50 rounded-lg border border-calmon-200">
                        <div className="flex items-center justify-center w-8 h-8 bg-calmon-100 rounded-full">
                          {getEventIcon(event.event_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-calmon-900">{event.title}</h4>
                            <Badge variant="outline" className="text-xs border-calmon-300 text-calmon-700">
                              {getEventTypeText(event.event_type)}
                            </Badge>
                          </div>
                          {event.description && (
                            <p className="text-sm text-calmon-600 mb-2">{event.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-calmon-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(event.start_date).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                                {!event.all_day && (
                                  <> - {new Date(event.end_date).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</>
                                )}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.meet_url && (
                              <div className="flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                <span>Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-calmon-500 text-center py-4">
                      Nenhum evento para hoje
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-calmon-800">
                  <Clock className="h-5 w-5 text-calmon-600" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents && upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-calmon-50 rounded-lg border border-calmon-200">
                        <div className="flex items-center justify-center w-8 h-8 bg-calmon-100 rounded-full">
                          {getEventIcon(event.event_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-calmon-900">{event.title}</h4>
                            <Badge variant="outline" className="text-xs border-calmon-300 text-calmon-700">
                              {getEventTypeText(event.event_type)}
                            </Badge>
                          </div>
                          {event.description && (
                            <p className="text-sm text-calmon-600 mb-2">{event.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-calmon-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(event.start_date).toLocaleDateString('pt-BR', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(event.start_date).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-calmon-500 text-center py-4">
                      Nenhum evento próximo
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;
