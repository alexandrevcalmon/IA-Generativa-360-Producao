
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, BookOpen, Clock } from "lucide-react";
import { CollaboratorStats } from "@/hooks/useCollaboratorAnalytics";

interface CompanyCollaboratorsStatsProps {
  analytics: CollaboratorStats[] | undefined;
}

export const CompanyCollaboratorsStats = ({ analytics }: CompanyCollaboratorsStatsProps) => {
  const totalCollaborators = analytics?.length || 0;
  const activeCollaborators = analytics?.filter(c => c.collaborator.is_active).length || 0;
  const totalLessons = analytics?.reduce((sum, c) => sum + c.lessons_completed, 0) || 0;
  const totalHours = Math.round((analytics?.reduce((sum, c) => sum + c.total_watch_time_minutes, 0) || 0) / 60);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="glass-card border-0 shadow-lg hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-calmon-600" />
            <div>
              <p className="text-2xl font-bold text-calmon-800">{totalCollaborators}</p>
              <p className="text-sm text-calmon-700">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-0 shadow-lg hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-calmon-800">{activeCollaborators}</p>
              <p className="text-sm text-calmon-700">Ativos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-lg hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-calmon-800">{totalLessons}</p>
              <p className="text-sm text-calmon-700">Lições Concluídas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-lg hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-calmon-800">{totalHours}h</p>
              <p className="text-sm text-calmon-700">Tempo Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
