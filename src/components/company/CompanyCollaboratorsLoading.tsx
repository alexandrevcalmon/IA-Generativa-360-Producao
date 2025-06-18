
import { CompanyCollaboratorsHeader } from "./CompanyCollaboratorsHeader";

export const CompanyCollaboratorsLoading = () => {
  return (
    <div className="flex flex-col h-full">
      <CompanyCollaboratorsHeader />
      <div className="flex-1 p-6 bg-calmon-bg-gradient">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/80 rounded-lg shadow-sm"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
