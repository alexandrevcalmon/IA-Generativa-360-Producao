
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";
import { useCreateCompany } from "@/hooks/useCompanies";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useCreateCompanyFormData } from "@/components/company/CreateCompanyFormData";
import { CompanyBasicFields } from "@/components/company/CompanyBasicFields";
import { CompanyAddressFields } from "@/components/company/CompanyAddressFields";
import { CompanyContactFields } from "@/components/company/CompanyContactFields";
import { CompanyAdditionalFields } from "@/components/company/CompanyAdditionalFields";

interface CreateCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCompanyDialog({ isOpen, onClose }: CreateCompanyDialogProps) {
  const { formData, setFormData } = useCreateCompanyFormData(isOpen);
  const createCompanyMutation = useCreateCompany();
  const { data: plans, isLoading: plansLoading, error: plansError } = useSubscriptionPlans();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Nome Fantasia é obrigatório.");
      return;
    }

    if (!formData.subscription_plan_id || !formData.billing_period) {
      alert("Por favor, selecione um plano de assinatura e período de cobrança.");
      return;
    }

    try {
      await createCompanyMutation.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create company from dialog:", error);
    }
  };

  const handlePlanChange = (planId: string, billingPeriod: 'semester' | 'annual') => {
    setFormData(prev => ({ 
      ...prev, 
      subscription_plan_id: planId,
      billing_period: billingPeriod
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Building2 className="h-5 w-5 mr-2 text-calmon-600" />
            Cadastrar Nova Empresa
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da empresa cliente que será cadastrada na plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 py-4">
          <CompanyBasicFields formData={formData} setFormData={setFormData} />
          <CompanyAddressFields formData={formData} setFormData={setFormData} />
          <CompanyContactFields formData={formData} setFormData={setFormData} />
          <CompanyAdditionalFields
            formData={formData}
            setFormData={setFormData}
            plans={plans || []}
            plansLoading={plansLoading}
            plansError={plansError}
            onPlanChange={handlePlanChange}
          />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={createCompanyMutation.isPending}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white min-w-[150px]"
              disabled={createCompanyMutation.isPending || plansLoading || !!plansError}
            >
              {createCompanyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {createCompanyMutation.isPending ? "Cadastrando..." : "Cadastrar Empresa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
