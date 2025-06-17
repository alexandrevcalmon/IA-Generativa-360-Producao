
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { CompanyWithPlan } from "@/hooks/useCompaniesWithPlans";
import { Company } from "@/hooks/useCompanies";
import { getPlanBadgeColor, getPlanIcon } from "@/utils/planUtils";

interface CompanyListItemProps {
  company: CompanyWithPlan;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => Promise<void>;
  isDeleting: boolean;
  transformCompany: (company: CompanyWithPlan) => Company;
}

export function CompanyListItem({ 
  company, 
  onEdit, 
  onDelete, 
  isDeleting,
  transformCompany 
}: CompanyListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {company.logo_url ? (
          <img src={company.logo_url} alt={`${company.name} logo`} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-calmon-500 to-calmon-700 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
        )}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{company.name}</h3>
            {company.subscription_plan && (
              <Badge
                variant="outline"
                className={`text-xs ${getPlanBadgeColor(company.subscription_plan.name)}`}
              >
                {getPlanIcon(company.subscription_plan.name)}
                <span className="ml-1 capitalize">{company.subscription_plan.name}</span>
              </Badge>
            )}
            {!company.is_active && (
              <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                Inativa
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
            <span>{company.current_students || 0}/{company.max_students || 'N/A'} colaboradores</span>
            <span>•</span>
            <span>Desde {new Date(company.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-right mr-4">
          <div className="text-sm font-medium">
            {company.max_students && company.max_students > 0
              ? `${Math.round(((company.current_students || 0) / company.max_students) * 100)}% ocupação`
              : "N/A"}
          </div>
          {company.max_students && company.max_students > 0 && (
            <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-full bg-gradient-to-r from-calmon-500 to-calmon-700 rounded-full"
                style={{ width: `${((company.current_students || 0) / company.max_students) * 100}%` }}
              />
            </div>
          )}
        </div>

        <Link to={`/producer/companies/${company.id}`}>
          <Button size="sm" variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            Ver Detalhes
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem
              onClick={() => onEdit(transformCompany(company))}
            >
              <Edit className="h-3 w-3 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
              onClick={async () => {
                if (window.confirm(`Tem certeza que deseja excluir a empresa "${company.name}"? Esta ação não pode ser desfeita.`)) {
                  try {
                    await onDelete(company.id);
                  } catch (err) {
                    console.error("Falha ao excluir empresa:", err);
                  }
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3 mr-2" />
              )}
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
