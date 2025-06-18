
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

interface StudentGoalProgressProps {
  nextGoalProgress: number;
}

export const StudentGoalProgress = ({ nextGoalProgress }: StudentGoalProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-600" />
          Próxima Meta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completar 5 lições esta semana</span>
            <span className="text-sm font-medium">{nextGoalProgress}%</span>
          </div>
          <Progress value={nextGoalProgress} />
          <p className="text-xs text-gray-500">Faltam 2 lições para atingir sua meta!</p>
        </div>
      </CardContent>
    </Card>
  );
};
