
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CollaboratorStats } from "@/hooks/useCollaboratorAnalytics";
import { CompanyCollaboratorsListFilters } from "./CompanyCollaboratorsListFilters";
import { CompanyCollaboratorListItem } from "./CompanyCollaboratorListItem";
import { CompanyCollaboratorsListEmpty } from "./CompanyCollaboratorsListEmpty";

interface CompanyCollaboratorsListProps {
  collaborators: CollaboratorStats[];
  onViewDetails?: (collaboratorId: string) => void;
}

export const CompanyCollaboratorsList = ({ 
  collaborators, 
  onViewDetails 
}: CompanyCollaboratorsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredCollaborators = collaborators
    .filter(c => 
      c.collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.collaborator.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.collaborator.name.localeCompare(b.collaborator.name);
        case "lessons":
          return b.lessons_completed - a.lessons_completed;
        case "time":
          return b.total_watch_time_minutes - a.total_watch_time_minutes;
        case "level":
          return b.current_level - a.current_level;
        default:
          return 0;
      }
    });

  return (
    <Card>
      <CardHeader>
        <CompanyCollaboratorsListFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={filteredCollaborators.length}
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredCollaborators.map((stat) => (
            <CompanyCollaboratorListItem
              key={stat.id}
              stat={stat}
              onViewDetails={onViewDetails}
            />
          ))}
          
          {filteredCollaborators.length === 0 && (
            <CompanyCollaboratorsListEmpty />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
