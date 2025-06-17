
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { UserPlus, Mail, User, Briefcase, Loader2 } from "lucide-react";
import { useAddCompanyCollaborator, CreateCollaboratorData } from "@/hooks/useCompanyCollaborators";
import { useAuth } from "@/hooks/useAuth";

interface AddCollaboratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

interface CollaboratorFormData {
  name: string;
  email: string;
  position: string;
}

const initialFormData: CollaboratorFormData = {
  name: "",
  email: "",
  position: "",
};

export function AddCollaboratorDialog({ isOpen, onClose, companyId }: AddCollaboratorDialogProps) {
  const [formData, setFormData] = useState<CollaboratorFormData>(initialFormData);
  const addCollaboratorMutation = useAddCompanyCollaborator();
  const { userRole } = useAuth();

  useEffect(() => {
    // Reset form when dialog opens or companyId changes
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      alert("ID da empresa não encontrado. Não é possível adicionar colaborador.");
      return;
    }

    // Ensure only producers can create collaborators
    if (userRole !== 'producer') {
      alert("Apenas produtores podem adicionar colaboradores.");
      return;
    }

    const submissionData: CreateCollaboratorData = {
      ...formData,
      company_id: companyId,
      position: formData.position || null,
    };

    console.log('Producer creating collaborator, session protection should be active');

    try {
      await addCollaboratorMutation.mutateAsync(submissionData);
      onClose();
    } catch (error) {
      // Error is handled by the hook's onError toast
      console.error("Failed to add collaborator from dialog:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[450px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <UserPlus className="h-5 w-5 mr-2 text-calmon-600" />
            Adicionar Colaborador
          </DialogTitle>
          <DialogDescription>
            Adicione um novo colaborador à empresa. Um usuário será criado e ele precisará definir uma senha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collaborator-name" className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Nome Completo *
            </Label>
            <Input
              id="collaborator-name"
              placeholder="Digite o nome completo"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collaborator-email" className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Email *
            </Label>
            <Input
              id="collaborator-email"
              type="email"
              placeholder="Digite o email do colaborador"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collaborator-position" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              Cargo (Opcional)
            </Label>
            <Input
              id="collaborator-position"
              placeholder="Ex: Desenvolvedor, Designer"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            />
             <p className="text-xs text-gray-500">
              O colaborador será criado no sistema e precisará definir uma senha no primeiro acesso.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={addCollaboratorMutation.isPending}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white min-w-[160px]"
              disabled={addCollaboratorMutation.isPending}
            >
              {addCollaboratorMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {addCollaboratorMutation.isPending ? "Adicionando..." : "Adicionar Colaborador"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
