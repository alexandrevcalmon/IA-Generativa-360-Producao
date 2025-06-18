
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProducerMentorshipHeader } from "@/components/producer/ProducerMentorshipHeader";
import { ProducerMentorshipSessionCard } from "@/components/producer/ProducerMentorshipSessionCard";
import { CreateMentorshipSessionDialog } from "@/components/producer/CreateMentorshipSessionDialog";
import { SessionParticipantsDialog } from "@/components/producer/SessionParticipantsDialog";
import { useMentorshipSessions, useUpdateMentorshipSession, MentorshipSession } from "@/hooks/useMentorshipSessions";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const ProducerMentorship = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSession, setEditingSession] = useState<MentorshipSession | null>(null);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null);

  const { data: sessions = [], isLoading } = useMentorshipSessions();
  const updateMutation = useUpdateMentorshipSession();

  const handleEditSession = (session: MentorshipSession) => {
    setEditingSession(session);
    setShowCreateDialog(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
      try {
        await updateMutation.mutateAsync({
          id: sessionId,
          updates: { is_active: false, status: 'cancelled' }
        });
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleViewParticipants = (session: MentorshipSession) => {
    setSelectedSession(session);
    setShowParticipantsDialog(true);
  };

  const handleCreateSession = () => {
    setEditingSession(null);
    setShowCreateDialog(true);
  };

  const activeSessions = sessions.filter(session => session.is_active);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sessões de Mentoria</h1>
            <p className="text-gray-600">Gerencie suas sessões de mentoria e participantes</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          <ProducerMentorshipHeader onCreateSession={handleCreateSession} />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p>Carregando sessões...</p>
            </div>
          ) : activeSessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma sessão criada
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece criando sua primeira sessão de mentoria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeSessions.map((session) => (
                <ProducerMentorshipSessionCard
                  key={session.id}
                  session={session}
                  onEdit={handleEditSession}
                  onDelete={handleDeleteSession}
                  onViewParticipants={handleViewParticipants}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateMentorshipSessionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        editingSession={editingSession}
      />

      <SessionParticipantsDialog
        open={showParticipantsDialog}
        onOpenChange={setShowParticipantsDialog}
        session={selectedSession}
      />
    </div>
  );
};

export default ProducerMentorship;
