
import { useStudentPoints, useStudentAchievements, useAvailableAchievements, usePointsHistory } from '@/hooks/useStudentGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Award, TrendingUp, Calendar } from 'lucide-react';

const StudentGamification = () => {
  const { data: studentPoints } = useStudentPoints();
  const { data: studentAchievements } = useStudentAchievements();
  const { data: availableAchievements } = useAvailableAchievements();
  const { data: pointsHistory } = usePointsHistory();

  const currentLevel = studentPoints?.level || 1;
  const currentPoints = studentPoints?.points || 0;
  const totalPoints = studentPoints?.total_points || 0;
  const streakDays = studentPoints?.streak_days || 0;
  
  // Calculate points needed for next level (100 points per level)
  const pointsForNextLevel = currentLevel * 100;
  const pointsProgress = (currentPoints % 100);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Gamificação
            </h1>
            <p className="text-calmon-100">
              Acompanhe seu progresso e conquistas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Trophy className="w-3 h-3 mr-1" />
              Nível {currentLevel}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Star className="w-3 h-3 mr-1" />
              {totalPoints} pontos totais
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-calmon-bg-gradient">
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-calmon-800">
                  <TrendingUp className="h-5 w-5 text-calmon-600" />
                  Progresso do Nível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-calmon-700">Nível {currentLevel}</span>
                    <span className="text-sm text-calmon-500">
                      {pointsProgress}/100 pontos
                    </span>
                  </div>
                  <Progress value={pointsProgress} className="h-3" />
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-calmon-500" />
                      <span className="text-calmon-700">{currentPoints} pontos atuais</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-calmon-500" />
                      <span className="text-calmon-700">{streakDays} dias seguidos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Achievements */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-calmon-800">
                    <Trophy className="h-5 w-5 text-calmon-600" />
                    Suas Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentAchievements?.length ? (
                      studentAchievements.map((achievement: any) => (
                        <div key={achievement.id} className="flex items-center gap-3 p-3 bg-calmon-50 rounded-lg border border-calmon-200">
                          <Award className="h-6 w-6 text-calmon-600" />
                          <div className="flex-1">
                            <p className="font-medium text-calmon-900">
                              {achievement.achievements.name}
                            </p>
                            <p className="text-sm text-calmon-600">
                              {achievement.achievements.description}
                            </p>
                          </div>
                          <Badge 
                            className="text-xs border-calmon-300 text-calmon-800"
                            style={{ backgroundColor: achievement.achievements.badge_color }}
                          >
                            +{achievement.achievements.points_required}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-calmon-500 text-center py-4">
                        Nenhuma conquista ainda. Continue estudando!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Achievements */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-calmon-800">
                    <Star className="h-5 w-5 text-calmon-600" />
                    Próximas Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableAchievements?.slice(0, 5).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-calmon-50 rounded-lg border border-calmon-200">
                        <div className="w-6 h-6 bg-calmon-200 rounded flex items-center justify-center">
                          <Star className="h-4 w-4 text-calmon-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-calmon-900">{achievement.name}</p>
                          <p className="text-sm text-calmon-600">{achievement.description}</p>
                        </div>
                        {achievement.points_required && (
                          <Badge variant="outline" className="text-xs border-calmon-300 text-calmon-700">
                            {achievement.points_required} pts
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Points History */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-calmon-800">
                  <Zap className="h-5 w-5 text-calmon-600" />
                  Histórico de Pontos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pointsHistory?.length ? (
                    pointsHistory.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-calmon-50 rounded-lg border border-calmon-200">
                        <div>
                          <p className="font-medium text-calmon-900">
                            {entry.description || entry.action_type}
                          </p>
                          <p className="text-sm text-calmon-600">
                            {new Date(entry.earned_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge className="bg-calmon-100 text-calmon-800 border-calmon-200">
                          +{entry.points} pontos
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-calmon-500 text-center py-4">
                      Nenhum histórico de pontos ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGamification;
