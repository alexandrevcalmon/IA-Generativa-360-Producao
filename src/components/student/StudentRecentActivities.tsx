
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface Activity {
  type: string;
  title: string;
  time: string;
  points: number;
}

interface StudentRecentActivitiesProps {
  activities: Activity[];
}

export const StudentRecentActivities = ({ activities }: StudentRecentActivitiesProps) => {
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-800">{activity.title}</p>
                  <p className="text-xs text-amber-600">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                  +{activity.points}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-amber-600">Nenhuma atividade recente ainda.</p>
            <p className="text-sm text-amber-500 mt-1">Comece a estudar para ver suas atividades aqui!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
