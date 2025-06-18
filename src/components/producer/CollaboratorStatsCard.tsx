
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, BookOpen, Trophy, Target } from "lucide-react";
import { CollaboratorStats } from "@/hooks/useCollaboratorAnalytics";

interface CollaboratorStatsCardProps {
  stats: CollaboratorStats;
}

export const CollaboratorStatsCard = ({ stats }: CollaboratorStatsCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Nunca';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}min`;
    }
    return `${remainingMinutes}min`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(stats.collaborator.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">
                {stats.collaborator.name}
              </CardTitle>
              <p className="text-xs text-gray-500">{stats.collaborator.email}</p>
              {stats.collaborator.position && (
                <p className="text-xs text-gray-400">{stats.collaborator.position}</p>
              )}
            </div>
          </div>
          <Badge variant={stats.collaborator.is_active ? "default" : "secondary"}>
            {stats.collaborator.is_active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Último acesso</p>
              <p className="text-sm font-medium">{formatLastLogin(stats.last_login_at)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Lições completadas</p>
              <p className="text-sm font-medium">{stats.lessons_completed}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Tempo de estudo</p>
              <p className="text-sm font-medium">{formatWatchTime(stats.total_watch_time_minutes)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Cursos inscritos</p>
              <p className="text-sm font-medium">{stats.courses_enrolled}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Nível {stats.current_level}</span>
            <span>{stats.total_points} pontos</span>
            <span>{stats.streak_days} dias seguidos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
