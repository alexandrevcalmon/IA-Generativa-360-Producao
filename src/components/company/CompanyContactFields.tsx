
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyData } from "@/hooks/useCompanies";

interface CompanyContactFieldsProps {
  formData: CompanyData;
  setFormData: React.Dispatch<React.SetStateAction<CompanyData>>;
}

export function CompanyContactFields({ formData, setFormData }: CompanyContactFieldsProps) {
  return (
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
  );
}
