
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CompanyCollaboratorsEmptyStateProps {
  searchTerm: string;
}

export const CompanyCollaboratorsEmptyState = ({ searchTerm }: CompanyCollaboratorsEmptyStateProps) => {
  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <Users className="h-12 w-12 mx-auto text-calmon-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-calmon-800">
          {searchTerm ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador cadastrado'}
        </h3>
        <p className="text-calmon-600">
          {searchTerm 
            ? 'Tente buscar com outros termos ou limpe o filtro'
            : 'Entre em contato com o administrador para adicionar colaboradores'
          }
        </p>
      </CardContent>
    </Card>
  );
};
