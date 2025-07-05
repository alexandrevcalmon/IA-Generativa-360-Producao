
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  UserCog, 
  UserX, 
  UserCheck, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar,
  MailOpen,
  Loader2
} from "lucide-react";
import { 
  Collaborator, 
  useToggleCollaboratorStatus,
  useResendInvitation 
} from "@/hooks/collaborators";

interface CompanyCollaboratorsListProps {
  collaborators: Collaborator[];
  companyId: string;
  onEdit: (collaborator: Collaborator) => void;
}

export function CompanyCollaboratorsList({ 
  collaborators, 
  companyId, 
  onEdit 
}: CompanyCollaboratorsListProps) {
  const toggleStatusMutation = useToggleCollaboratorStatus();
  const resendInvitationMutation = useResendInvitation();

  const handleToggleStatus = async (collaborator: Collaborator) => {
    await toggleStatusMutation.mutateAsync({
      collaboratorId: collaborator.id,
      companyId: companyId,
      isActive: !collaborator.is_active
    });
  };

  const handleResendInvitation = async (collaborator: Collaborator) => {
    await resendInvitationMutation.mutateAsync({
      collaborator_id: collaborator.id,
      company_id: companyId
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (collaborators.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum colaborador cadastrado
          </h3>
          <p className="text-gray-600">
            Adicione colaboradores para começar a gerenciar sua equipe.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {collaborators.map((collaborator) => (
        <Card key={collaborator.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {collaborator.name}
                  </h3>
                  <Badge 
                    variant={collaborator.is_active ? "default" : "secondary"}
                    className={collaborator.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {collaborator.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                  {collaborator.needs_password_change && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Aguardando ativação
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{collaborator.email}</span>
                  </div>
                  
                  {collaborator.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{collaborator.phone}</span>
                    </div>
                  )}
                  
                  {collaborator.position && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{collaborator.position}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Adicionado em {formatDate(collaborator.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {collaborator.is_active && collaborator.needs_password_change && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendInvitation(collaborator)}
                    disabled={resendInvitationMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {resendInvitationMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MailOpen className="h-4 w-4" />
                    )}
                    Reenviar Convite
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(collaborator)}
                  className="flex items-center gap-2"
                >
                  <UserCog className="h-4 w-4" />
                  Editar
                </Button>

                <Button
                  variant={collaborator.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleStatus(collaborator)}
                  disabled={toggleStatusMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {toggleStatusMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : collaborator.is_active ? (
                    <UserX className="h-4 w-4" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                  {collaborator.is_active ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
