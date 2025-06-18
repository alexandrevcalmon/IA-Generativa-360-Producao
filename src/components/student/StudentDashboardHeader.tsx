
import { useAuth } from '@/hooks/auth';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp } from 'lucide-react';

interface StudentDashboardHeaderProps {
  totalPoints: number;
  currentStreak: number;
}

export const StudentDashboardHeader = ({ totalPoints, currentStreak }: StudentDashboardHeaderProps) => {
  const { companyUserData } = useAuth();

  return (
    <div className="bg-white border-b p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {companyUserData?.name || 'Estudante'}! 👋
          </h1>
          <p className="text-gray-600">
            Continue sua jornada de aprendizado
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Trophy className="w-3 h-3 mr-1" />
            {totalPoints} pontos
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            {currentStreak} dias seguidos
          </Badge>
        </div>
      </div>
    </div>
  );
};
