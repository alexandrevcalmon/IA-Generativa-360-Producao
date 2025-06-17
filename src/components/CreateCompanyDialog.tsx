
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Building2, Upload } from "lucide-react";

interface CreateCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCompanyDialog({ isOpen, onClose }: CreateCompanyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    subscription_plan: "",
    max_students: "",
    logo_url: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating company:", formData);
    // Here you would integrate with Supabase to create the company
    onClose();
    setFormData({ name: "", subscription_plan: "", max_students: "", logo_url: "" });
  };

  const planOptions = [
    { value: "basic", label: "Básico - Até 50 colaboradores", maxStudents: 50 },
    { value: "business", label: "Business - Até 150 colaboradores", maxStudents: 150 },
    { value: "premium", label: "Premium - Até 200 colaboradores", maxStudents: 200 }
  ];

  const handlePlanChange = (value: string) => {
    const selectedPlan = planOptions.find(plan => plan.value === value);
    setFormData(prev => ({
      ...prev,
      subscription_plan: value,
      max_students: selectedPlan ? selectedPlan.maxStudents.toString() : ""
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Building2 className="h-5 w-5 mr-2 text-calmon-600" />
            Cadastrar Nova Empresa
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da empresa cliente que será cadastrada na plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              placeholder="Digite o nome da empresa"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Plano de Assinatura *</Label>
            <Select onValueChange={handlePlanChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {planOptions.map(plan => (
                  <SelectItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_students">Máximo de Colaboradores</Label>
            <Input
              id="max_students"
              type="number"
              placeholder="50"
              value={formData.max_students}
              onChange={(e) => setFormData(prev => ({ ...prev, max_students: e.target.value }))}
              disabled={!!formData.subscription_plan}
            />
            <p className="text-xs text-gray-500">
              Este valor é definido automaticamente baseado no plano selecionado
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo da Empresa (Opcional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Clique para fazer upload do logo</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG até 2MB</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
            >
              Cadastrar Empresa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
