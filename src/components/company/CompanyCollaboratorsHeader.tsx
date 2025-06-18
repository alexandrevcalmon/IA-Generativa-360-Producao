
import { SidebarTrigger } from "@/components/ui/sidebar";

interface CompanyCollaboratorsHeaderProps {
  companyName?: string;
}

export const CompanyCollaboratorsHeader = ({ companyName }: CompanyCollaboratorsHeaderProps) => {
  return (
    <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-white hover:bg-white/20" />
        <div>
          <h1 className="text-2xl font-bold text-white">Colaboradores</h1>
          <p className="text-calmon-100">
            Gerencie os colaboradores da {companyName || 'empresa'}
          </p>
        </div>
      </div>
    </header>
  );
};
