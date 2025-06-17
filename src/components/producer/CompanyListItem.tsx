
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash2, Users, Building } from "lucide-react";
import { CompanyWithPlan } from "@/hooks/useCompaniesWithPlans";
import { Company } from "@/hooks/useCompanies";
import { getPlanBadgeColor, getPlanIcon } from "@/utils/planUtils";

interface CompanyListItemProps {
  company: CompanyWithPlan;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => Promise<void>;
  deletingCompanyId: string | null;
  transformCompany: (company: CompanyWithPlan) => Company;
}

export function CompanyListItem({
  company,
  onEdit,
  onDelete,
  deletingCompanyId,
  transformCompany,
}: CompanyListItemProps) {
  const isDeleting = deletingCompanyId === company.id;
  const planName = company.subscription_plan?.name;

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{company.name}</h3>
              {company.official_name && company.official_name !== company.name && (
                <p className="text-sm text-gray-500">{company.official_name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{company.current_students || 0} colaboradores</span>
            </div>
            
            {planName && (
              <Badge className={getPlanBadgeColor(planName)}>
                {getPlanIcon(planName)}
                <span className="ml-1">{planName}</span>
              </Badge>
            )}
            
            <Badge variant={company.is_active ? "default" : "secondary"}>
              {company.is_active ? "Ativa" : "Inativa"}
            </Badge>
          </div>

          {company.contact_email && (
            <p className="text-sm text-gray-500 mt-1">{company.contact_email}</p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(transformCompany(company))}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(company.id)}
              disabled={isDeleting}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
