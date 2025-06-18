
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CompanyCollaboratorsSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const CompanyCollaboratorsSearch = ({ 
  searchTerm, 
  setSearchTerm 
}: CompanyCollaboratorsSearchProps) => {
  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-calmon-600 h-4 w-4" />
          <Input
            placeholder="Buscar colaboradores por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-calmon-200 focus:border-calmon-500 focus:ring-calmon-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};
