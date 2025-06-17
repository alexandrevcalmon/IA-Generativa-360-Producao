import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Added for buttons
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Building2, Loader2, Upload } from "lucide-react"; // Added Upload for consistency, though not used
import { Company, CompanyData, useUpdateCompany } from "@/hooks/useCompanies";
import { useSubscriptionPlans, SubscriptionPlan } from "@/hooks/useSubscriptionPlans";

interface EditCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
}

const initialFormData: Partial<CompanyData> = {
  name: "",
  official_name: "",
  // Add other fields as needed for the form
};

export function EditCompanyDialog({ isOpen, onClose, company }: EditCompanyDialogProps) {
  const [formData, setFormData] = useState<Partial<CompanyData>>(initialFormData);
  const updateCompanyMutation = useUpdateCompany();
  const {
    data: plans,
    isLoading: plansLoading,
    error: plansError
  } = useSubscriptionPlans();

  useEffect(() => {
    if (company && isOpen) {
      // Ensure all fields from CompanyData are populated, including subscription_plan_id
      setFormData({
        name: company.name || "",
        official_name: company.official_name || "",
        cnpj: company.cnpj || "",
        email: company.email || "",
        phone: company.phone || "",
        address_street: company.address_street || "",
        address_number: company.address_number || "",
        address_complement: company.address_complement || "",
        address_district: company.address_district || "",
        address_city: company.address_city || "",
        address_state: company.address_state || "",
        address_zip_code: company.address_zip_code || "",
        contact_name: company.contact_name || "",
        contact_email: company.contact_email || "",
        contact_phone: company.contact_phone || "",
        notes: company.notes || "",
        // subscription_plan_id should come from company.subscription_plan_id directly
        // as per the Company interface which has subscription_plan_id from the companies table
        // and a nested subscription_plan object from the join.
        subscription_plan_id: company.subscription_plan_id || null,
      });
    } else if (!isOpen) {
      setFormData(initialFormData); // Reset form when dialog is closed
    }
  }, [company, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    // TODO: Complete form fields and enhance submit logic
    // Basic validation example
    if (!formData.name) {
        alert("Nome Fantasia é obrigatório.");
        return;
    }

    try {
      await updateCompanyMutation.mutateAsync({ id: company.id, ...formData });
      onClose();
    } catch (error) {
      // Error is handled by the hook's onError
      console.error("Failed to update company from dialog:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Building2 className="h-5 w-5 mr-2 text-calmon-600" />
            Editar Empresa: {company?.name}
          </DialogTitle>
          <DialogDescription>
            Atualize as informações da empresa cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 py-4">
          {/* TODO: Complete form fields and enhance submit logic */}
          {/* For now, only a few fields for testing pre-fill */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-1">Dados da Empresa</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Fantasia *</Label>
                <Input
                  id="edit-name"
                  placeholder="Nome Fantasia da Empresa"
                  value={formData.name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-official_name">Razão Social</Label>
                <Input
                  id="edit-official_name"
                  placeholder="Razão Social da Empresa"
                  value={formData.official_name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, official_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cnpj">CNPJ</Label>
                <Input
                  id="edit-cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company_email">Email da Empresa</Label>
                <Input
                  id="edit-company_email"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-company_phone">Telefone da Empresa</Label>
                <Input
                  id="edit-company_phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </fieldset>

          {/* Endereço */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-1">Endereço</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-address_street">Logradouro</Label>
                <Input
                  id="edit-address_street"
                  placeholder="Rua, Av., etc."
                  value={formData.address_street || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_street: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address_number">Número</Label>
                <Input
                  id="edit-address_number"
                  placeholder="123"
                  value={formData.address_number || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_number: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address_complement">Complemento</Label>
                <Input
                  id="edit-address_complement"
                  placeholder="Apto, Bloco, Sala"
                  value={formData.address_complement || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_complement: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address_district">Bairro</Label>
                <Input
                  id="edit-address_district"
                  placeholder="Centro, etc."
                  value={formData.address_district || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_district: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address_city">Cidade</Label>
                <Input
                  id="edit-address_city"
                  placeholder="Sua Cidade"
                  value={formData.address_city || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_city: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-address_state">Estado (UF)</Label>
                  <Input
                    id="edit-address_state"
                    placeholder="SP"
                    value={formData.address_state || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_state: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address_zip_code">CEP</Label>
                  <Input
                    id="edit-address_zip_code"
                    placeholder="00000-000"
                    value={formData.address_zip_code || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_zip_code: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Contato Principal */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-1">Contato Principal</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-contact_name">Nome do Contato</Label>
                <Input
                  id="edit-contact_name"
                  placeholder="Nome Completo"
                  value={formData.contact_name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact_email">Email do Contato</Label>
                <Input
                  id="edit-contact_email"
                  type="email"
                  placeholder="contato@exemplo.com"
                  value={formData.contact_email || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-contact_phone">Telefone do Contato</Label>
                <Input
                  id="edit-contact_phone"
                  placeholder="(00) 00000-0000"
                  value={formData.contact_phone || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                />
              </div>
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="edit-plan">Plano de Assinatura</Label>
            <Select
              value={formData.subscription_plan_id || ""}
              onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_plan_id: value }))}
              // required // A company must have a plan, but it might be unassigned temporarily?
            >
              <SelectTrigger disabled={plansLoading || !!plansError}>
                <SelectValue placeholder={plansLoading ? "Carregando planos..." : (plansError ? "Erro ao carregar planos" : "Selecione um plano")} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {plans && plans.filter(p => p.is_active || p.id === company?.subscription_plan_id).map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} (Sem: R${plan.semester_price.toFixed(2)} / Ano: R${plan.annual_price.toFixed(2)}) - Máx: {plan.max_students} alunos
                    {!plan.is_active && company?.subscription_plan_id === plan.id && " (Plano atual inativo)"}
                  </SelectItem>
                ))}
                 {plansError && <SelectItem value="error" disabled>Não foi possível carregar os planos.</SelectItem>}
              </SelectContent>
            </Select>
            {plansError && <p className="text-xs text-red-500">Erro ao carregar planos. Tente novamente.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Observações</Label>
            <Textarea
              id="edit-notes"
              placeholder="Alguma observação sobre a empresa..."
              value={formData.notes || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* TODO: Implement logo upload functionality */}
          <div className="space-y-2">
            <Label htmlFor="edit-logo">Logo da Empresa (Opcional - Funcionalidade pendente)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-not-allowed bg-gray-50">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload do logo ainda não implementado</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG até 2MB</p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateCompanyMutation.isPending}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white min-w-[150px]"
              disabled={updateCompanyMutation.isPending || plansLoading || !!plansError}
            >
              {updateCompanyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {updateCompanyMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
