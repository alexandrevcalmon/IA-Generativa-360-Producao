
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CompanyCollaboratorsListFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  totalCount: number;
}

export const CompanyCollaboratorsListFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  totalCount
}: CompanyCollaboratorsListFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <h3 className="text-lg font-medium">Lista de Colaboradores ({totalCount})</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar colaboradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
        >
          <option value="name">Ordenar por Nome</option>
          <option value="lessons">Ordenar por Lições</option>
          <option value="time">Ordenar por Tempo</option>
          <option value="level">Ordenar por Nível</option>
        </select>
      </div>
    </div>
  );
};
