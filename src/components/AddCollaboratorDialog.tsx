
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
import { useState } from "react";
import { UserPlus, Mail, User } from "lucide-react";

interface AddCollaboratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export function AddCollaboratorDialog({ isOpen, onClose, companyId }: AddCollaboratorDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding collaborator to company:", companyId, formData);
    // Here you would integrate with Supabase to create the collaborator
    onClose();
    setFormData({ name: "", email: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <UserPlus className="h-5 w-5 mr-2 text-calmon-600" />
            Adicionar Colaborador
          </DialogTitle>
          <DialogDescription>
            Adicione um novo colaborador à empresa. Ele receberá um convite por email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-xs text-gray-500">
              O colaborador receberá um convite para se cadastrar na plataforma
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
            >
              Enviar Convite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
