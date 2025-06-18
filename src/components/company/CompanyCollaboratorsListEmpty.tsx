
import { BookOpen } from "lucide-react";

export const CompanyCollaboratorsListEmpty = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-medium mb-2">Nenhum colaborador encontrado</p>
      <p>Tente ajustar os filtros de busca</p>
    </div>
  );
};
