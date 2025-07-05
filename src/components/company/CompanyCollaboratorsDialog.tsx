
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus
} from "lucide-react";
import { useState } from "react";
import { 
  useGetCompanyCollaborators, 
  Collaborator
} from "@/hooks/useCompanyCollaborators";
import { AddCollaboratorDialog } from "@/components/AddCollaboratorDialog";
import { EditCollaboratorDialog } from "@/components/EditCollaboratorDialog";
import { CompanyWithPlan } from "@/hooks/useCompaniesWithPlans";
import { CompanyCollaboratorsList } from "./CompanyCollaboratorsList";

interface CompanyCollaboratorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyWithPlan;
}

export function CompanyCollaboratorsDialog({ 
  isOpen, 
  onClose, 
  company 
}: CompanyCollaboratorsDialogProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  
  const { data: collaborators = [], isLoading } = useGetCompanyCollaborators(company.id);

  const activeCollaborators = collaborators.filter(c => c.is_active);
  
  // Get the max collaborators from the company's subscription plan
  const maxCollaborators = company.subscription_plan?.max_students || 5;
  const canAddMore = activeCollaborators.length < maxCollaborators;

  const handleEditCollaborator = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-calmon-600" />
              Colaboradores - {company.name}
            </DialogTitle>
            <DialogDescription>
              Gerencie os colaboradores desta empresa. Máximo de {maxCollaborators} colaboradores ativos conforme o plano {company.subscription_plan?.name || 'contratado'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header com estatísticas */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-lg">
                    {activeCollaborators.length}/{maxCollaborators}
                  </span> colaboradores ativos
                </div>
                {!canAddMore && (
                  <Badge variant="secondary" className="text-amber-600 bg-amber-50">
                    Limite do plano atingido
                  </Badge>
                )}
                {company.subscription_plan && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Plano {company.subscription_plan.name}
                  </Badge>
                )}
              </div>
              
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                disabled={!canAddMore}
                className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Colaborador
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando colaboradores...</p>
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Nenhum colaborador cadastrado</p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Colaborador
                </Button>
              </div>
            ) : (
              <CompanyCollaboratorsList
                collaborators={collaborators}
                companyId={company.id}
                onEdit={handleEditCollaborator}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddCollaboratorDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        companyId={company.id}
      />

      {editingCollaborator && (
        <EditCollaboratorDialog
          isOpen={!!editingCollaborator}
          onClose={() => setEditingCollaborator(null)}
          collaborator={editingCollaborator}
          companyId={company.id}
        />
      )}
    </>
  );
}
