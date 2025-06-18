
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CollaboratorAnalyticsHeaderProps {
  onRefresh: () => void;
}

export const CollaboratorAnalyticsHeader = ({ onRefresh }: CollaboratorAnalyticsHeaderProps) => {
  return (
    <div className="border-b bg-white px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics de Colaboradores</h1>
          <p className="text-gray-600">Acompanhe o desempenho e engajamento dos colaboradores</p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};
