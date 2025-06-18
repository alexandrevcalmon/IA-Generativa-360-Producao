
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  Clock, 
  BookOpen, 
  Trophy, 
  TrendingUp
} from "lucide-react";
import { CollaboratorStats } from "@/hooks/useCollaboratorAnalytics";

interface CompanyCollaboratorListItemProps {
  stat: CollaboratorStats;
  onViewDetails?: (collaboratorId: string) => void;
}

export const CompanyCollaboratorListItem = ({ 
  stat, 
  onViewDetails 
}: CompanyCollaboratorListItemProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Colaborador Info */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {getInitials(stat.collaborator.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {stat.collaborator.name}
            </h3>
            <Badge 
              variant={stat.collaborator.is_active ? "default" : "secondary"}
              className="text-xs"
            >
              {stat.collaborator.is_active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500 truncate">
            {stat.collaborator.email}
          </p>
          
          {stat.collaborator.position && (
            <p className="text-xs text-gray-400 truncate">
              {stat.collaborator.position}
            </p>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="hidden lg:flex items-center space-x-8 text-sm">
        <div className="text-center">
          <div className="flex items-center text-blue-600 mb-1">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="font-medium">{stat.lessons_completed}</span>
          </div>
          <span className="text-xs text-gray-500">Lições</span>
        </div>
        
        <div className="text-center">
          <div className="flex items-center text-green-600 mb-1">
            <Clock className="h-4 w-4 mr-1" />
            <span className="font-medium">{formatTime(stat.total_watch_time_minutes)}</span>
          </div>
          <span className="text-xs text-gray-500">Tempo</span>
        </div>
        
        <div className="text-center">
          <div className="flex items-center text-purple-600 mb-1">
            <Trophy className="h-4 w-4 mr-1" />
            <span className="font-medium">Nível {stat.current_level}</span>
          </div>
          <span className="text-xs text-gray-500">{stat.total_points} pts</span>
        </div>
        
        <div className="text-center">
          <div className="flex items-center text-orange-600 mb-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="font-medium">{stat.courses_enrolled}</span>
          </div>
          <span className="text-xs text-gray-500">Cursos</span>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="flex items-center space-x-4 ml-4">
        <div className="hidden md:block w-24">
          <div className="flex justify-between text-xs mb-1">
            <span>Progresso</span>
            <span>{Math.round((stat.lessons_completed / Math.max(stat.lessons_started || 1, 1)) * 100)}%</span>
          </div>
          <Progress 
            value={(stat.lessons_completed / Math.max(stat.lessons_started || 1, 1)) * 100} 
            className="h-2"
          />
        </div>
        
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(stat.collaborator_id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
        )}
      </div>
    </div>
  );
};
