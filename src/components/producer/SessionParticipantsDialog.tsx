
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail, Building2, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSessionParticipants, MentorshipSession } from "@/hooks/useMentorshipSessions";

interface SessionParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: MentorshipSession | null;
}

export const SessionParticipantsDialog = ({
  open,
  onOpenChange,
  session,
}: SessionParticipantsDialogProps) => {
  const { data: participants = [], isLoading } = useSessionParticipants(session?.id || "");

  if (!session) return null;

  const getAttendanceStatus = (attended?: boolean, joinedAt?: string) => {
    if (attended === true) {
      return <Badge className="bg-green-100 text-green-800">Presente</Badge>;
    } else if (attended === false) {
      return <Badge className="bg-red-100 text-red-800">Ausente</Badge>;
    } else if (joinedAt) {
      return <Badge className="bg-blue-100 text-blue-800">Participou</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Pendente</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Participantes - {session.title}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {participants.length} participante{participants.length !== 1 ? 's' : ''} inscrito{participants.length !== 1 ? 's' : ''}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center py-4">Carregando participantes...</p>
          ) : participants.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              Nenhum participante inscrito ainda
            </p>
          ) : (
            participants.map((participant) => (
              <Card key={participant.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{participant.participant_name}</h3>
                    {getAttendanceStatus(participant.attended, participant.joined_at)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {participant.participant_email}
                    </div>
                    
                    {participant.company_name && (
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        {participant.company_name}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Inscrito em {format(new Date(participant.registered_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                    
                    {participant.joined_at && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Entrou em {format(new Date(participant.joined_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        {participant.left_at && (
                          <span className="ml-2">
                            • Saiu em {format(new Date(participant.left_at), "HH:mm", { locale: ptBR })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
