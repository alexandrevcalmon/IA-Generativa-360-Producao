
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar } from "lucide-react";
import { CollaboratorStats } from "@/hooks/useCollaboratorAnalytics";

interface CompanyCollaboratorCardProps {
  stat: CollaboratorStats;
}

export const CompanyCollaboratorCard = ({ stat }: CompanyCollaboratorCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatLastLogin = (date: string | null) => {
    if (!date) return 'Nunca acessou';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="glass-card border-0 shadow-lg hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-calmon-100 text-calmon-700 font-semibold">
                {getInitials(stat.collaborator.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-calmon-900">
                  {stat.collaborator.name}
                </h3>
                <Badge 
                  variant={stat.collaborator.is_active ? "default" : "secondary"}
                  className={stat.collaborator.is_active 
                    ? "bg-green-100 text-green-700 border-green-200" 
                    : "bg-gray-100 text-gray-700 border-gray-200"
                  }
                >
                  {stat.collaborator.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-calmon-700">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{stat.collaborator.email}</span>
                </div>
                
                {stat.collaborator.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{stat.collaborator.phone}</span>
                  </div>
                )}
                
                {stat.collaborator.position && (
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Cargo:</span>
                    <span>{stat.collaborator.position}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Último acesso: {formatLastLogin(stat.last_login_at)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-calmon-100 rounded-lg p-3">
              <p className="text-lg font-semibold text-calmon-700">{stat.lessons_completed}</p>
              <p className="text-xs text-calmon-600">Lições</p>
            </div>
            <div className="bg-calmon-100 rounded-lg p-3">
              <p className="text-lg font-semibold text-calmon-700">{stat.courses_completed}</p>
              <p className="text-xs text-calmon-600">Cursos</p>
            </div>
            <div className="bg-calmon-100 rounded-lg p-3">
              <p className="text-lg font-semibold text-calmon-700">{stat.total_points}</p>
              <p className="text-xs text-calmon-600">Pontos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
