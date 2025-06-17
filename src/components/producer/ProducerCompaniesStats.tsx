
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Users } from "lucide-react";

interface ProducerCompaniesStatsProps {
  totalCompanies: number;
  activeCompanies: number;
  totalCollaborators: number;
}

export function ProducerCompaniesStats({ 
  totalCompanies, 
  activeCompanies, 
  totalCollaborators 
}: ProducerCompaniesStatsProps) {
  return (
    <>
      <Card className="hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Empresas</p>
              <p className="text-2xl font-bold">{totalCompanies}</p>
            </div>
            <Building2 className="h-8 w-8 text-calmon-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Empresas Ativas</p>
              <p className="text-2xl font-bold text-green-600">
                {activeCompanies}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Colaboradores</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalCollaborators}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
