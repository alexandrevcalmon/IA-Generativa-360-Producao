
import { useState } from "react";
import { useCollaboratorAnalytics } from "@/hooks/useCollaboratorAnalytics";
import { useCompanyData } from "@/hooks/useCompanyData";
import { CompanyCollaboratorsHeader } from "@/components/company/CompanyCollaboratorsHeader";
import { CompanyCollaboratorsStats } from "@/components/company/CompanyCollaboratorsStats";
import { CompanyCollaboratorsSearch } from "@/components/company/CompanyCollaboratorsSearch";
import { CompanyCollaboratorCard } from "@/components/company/CompanyCollaboratorCard";
import { CompanyCollaboratorsLoading } from "@/components/company/CompanyCollaboratorsLoading";
import { CompanyCollaboratorsError } from "@/components/company/CompanyCollaboratorsError";
import { CompanyCollaboratorsEmptyState } from "@/components/company/CompanyCollaboratorsEmptyState";

const CompanyCollaborators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: analytics, isLoading, error } = useCollaboratorAnalytics();
  const { data: companyData } = useCompanyData();

  if (isLoading) {
    return <CompanyCollaboratorsLoading />;
  }

  if (error) {
    return <CompanyCollaboratorsError companyName={companyData?.name} />;
  }

  const filteredCollaborators = analytics?.filter(collaborator =>
    collaborator.collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.collaborator.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-full">
      <CompanyCollaboratorsHeader companyName={companyData?.name} />

      <div className="flex-1 overflow-auto p-6 bg-calmon-bg-gradient">
        <div className="space-y-6">
          {/* Stats Cards */}
          <CompanyCollaboratorsStats analytics={analytics} />

          {/* Search */}
          <CompanyCollaboratorsSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Collaborators List */}
          {filteredCollaborators.length > 0 ? (
            <div className="grid gap-4">
              {filteredCollaborators.map((stat) => (
                <CompanyCollaboratorCard key={stat.id} stat={stat} />
              ))}
            </div>
          ) : (
            <CompanyCollaboratorsEmptyState searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCollaborators;
