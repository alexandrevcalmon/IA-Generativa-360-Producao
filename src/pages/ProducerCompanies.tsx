
import { useState } from "react";
import { CreateCompanyDialog } from "@/components/CreateCompanyDialog";
import { EditCompanyDialog } from "@/components/EditCompanyDialog";
import { useCompaniesWithPlans } from "@/hooks/useCompaniesWithPlans";
import { useDeleteCompany, Company } from "@/hooks/useCompanies";
import { transformCompanyWithPlanToCompany } from "@/utils/companyTransformations";
import { ProducerCompaniesHeader } from "@/components/producer/ProducerCompaniesHeader";
import { ProducerCompaniesSearch } from "@/components/producer/ProducerCompaniesSearch";
import { ProducerCompaniesStats } from "@/components/producer/ProducerCompaniesStats";
import { ProducerCompaniesList } from "@/components/producer/ProducerCompaniesList";
import { ProducerCompaniesLoading } from "@/components/producer/ProducerCompaniesLoading";

const ProducerCompanies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const { data: companies = [], isLoading, error } = useCompaniesWithPlans();
  const deleteCompanyMutation = useDeleteCompany();

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.is_active).length;
  const totalCollaborators = companies.reduce((sum, c) => sum + (c.current_students || 0), 0);

  const handleDeleteCompany = async (companyId: string) => {
    await deleteCompanyMutation.mutateAsync(companyId);
  };

  if (isLoading) {
    return <ProducerCompaniesLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-red-500 text-lg">Erro ao carregar as empresas.</p>
        <p>{(error as Error)?.message || "Tente novamente mais tarde."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ProducerCompaniesHeader onCreateCompany={() => setIsCreateDialogOpen(true)} />

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ProducerCompaniesSearch 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            
            <ProducerCompaniesStats
              totalCompanies={totalCompanies}
              activeCompanies={activeCompanies}
              totalCollaborators={totalCollaborators}
            />
          </div>

          <ProducerCompaniesList
            companies={filteredCompanies}
            onEdit={setEditingCompany}
            onDelete={handleDeleteCompany}
            deletingCompanyId={deleteCompanyMutation.isPending ? deleteCompanyMutation.variables : null}
            transformCompany={transformCompanyWithPlanToCompany}
          />
        </div>
      </div>

      <CreateCompanyDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      <EditCompanyDialog
        isOpen={!!editingCompany}
        onClose={() => setEditingCompany(null)}
        company={editingCompany}
      />
    </div>
  );
};

export default ProducerCompanies;
