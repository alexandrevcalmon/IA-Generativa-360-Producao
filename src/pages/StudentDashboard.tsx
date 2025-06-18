
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useStudentCourses } from '@/hooks/useStudentCourses';
import { useEnrollInCourse } from '@/hooks/useStudentProgress';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { companyUserData } = useAuth();
  const { data: courses, isLoading: coursesLoading } = useStudentCourses();
  const enrollMutation = useEnrollInCourse();

  console.log('Student courses data:', courses);

  // Calculate stats from real data
  const studentStats = {
    coursesInProgress: courses?.filter(c => c.enrolled_at && c.progress_percentage < 100).length || 0,
    completedCourses: courses?.filter(c => c.progress_percentage === 100).length || 0,
    totalPoints: courses?.reduce((total, course) => {
      return total + Math.floor(course.progress_percentage * 10); // 10 points per percentage
    }, 0) || 0,
    currentStreak: 7, // This would need to be calculated from lesson completion dates
    averageGrade: 8.5, // This would come from quiz results
    hoursStudied: courses?.reduce((total, course) => {
      return total + (course.estimated_hours * (course.progress_percentage / 100));
    }, 0) || 0,
    certificatesEarned: courses?.filter(c => c.progress_percentage === 100).length || 0,
    nextGoalProgress: 75
  };

  const recentActivities = [
    {
      type: 'course_progress',
      title: 'Progresso no curso atualizado',
      time: '2 horas atrás',
      points: 25
    },
    {
      type: 'lesson_completed',
      title: 'Lição completada',
      time: '1 dia atrás',
      points: 50
    },
    {
      type: 'goal_achieved',
      title: 'Meta Semanal Atingida',
      time: '2 dias atrás',
      points: 25
    }
  ];

  if (coursesLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Carregando...
              </h1>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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
              {studentStats.totalPoints} pontos
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              {studentStats.currentStreak} dias seguidos
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cursos em Andamento</p>
                    <p className="text-2xl font-bold text-gray-900">{studentStats.coursesInProgress}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cursos Concluídos</p>
                    <p className="text-2xl font-bold text-gray-900">{studentStats.completedCourses}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Horas Estudadas</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(studentStats.hoursStudied)}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Pontos</p>
                    <p className="text-2xl font-bold text-gray-900">{studentStats.totalPoints}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Actions - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Acesso Rápido
                  </CardTitle>
                  <CardDescription>
                    Navegue rapidamente pelas principais funcionalidades
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/student/courses">
                    <Button className="w-full h-20 flex flex-col items-center gap-2" variant="outline">
                      <BookOpen className="h-6 w-6" />
                      <span>Meus Cursos</span>
                    </Button>
                  </Link>
                  <Button className="w-full h-20 flex flex-col items-center gap-2" variant="outline" disabled>
                    <Calendar className="h-6 w-6" />
                    <span>Agenda</span>
                  </Button>
                  <Button className="w-full h-20 flex flex-col items-center gap-2" variant="outline" disabled>
                    <Trophy className="h-6 w-6" />
                    <span>Conquistas</span>
                  </Button>
                  <Button className="w-full h-20 flex flex-col items-center gap-2" variant="outline" disabled>
                    <Target className="h-6 w-6" />
                    <span>Metas</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Next Goal */}
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
                      <span className="text-sm font-medium">{studentStats.nextGoalProgress}%</span>
                    </div>
                    <Progress value={studentStats.nextGoalProgress} />
                    <p className="text-xs text-gray-500">Faltam 2 lições para atingir sua meta!</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{activity.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-yellow-50 rounded-lg text-center">
                      <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                      <p className="text-xs font-medium">Primeira Semana</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium">{studentStats.coursesInProgress} Cursos</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs font-medium">{studentStats.completedCourses} Concluídos</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs font-medium">{studentStats.totalPoints} Pontos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
