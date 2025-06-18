
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyCollaboratorsHeader } from "./CompanyCollaboratorsHeader";

interface CompanyCollaboratorsErrorProps {
  companyName?: string;
}

export const CompanyCollaboratorsError = ({ companyName }: CompanyCollaboratorsErrorProps) => {
  return (
    <div className="flex flex-col h-full">
      <CompanyCollaboratorsHeader companyName={companyName} />
      <div className="flex-1 p-6 bg-calmon-bg-gradient flex items-center justify-center">
        <Card className="glass-card border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4 font-medium">Erro ao carregar dados dos colaboradores</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-calmon-600 hover:bg-calmon-700 text-white"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
