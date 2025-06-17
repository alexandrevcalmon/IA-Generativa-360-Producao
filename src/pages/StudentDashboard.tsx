
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react';

const StudentDashboard = () => {
  const { companyUserData } = useAuth();

  // Mock data - em um caso real, esses dados viriam de APIs específicas
  const studentStats = {
    coursesInProgress: 3,
    completedCourses: 12,
    totalPoints: 850,
    currentStreak: 7,
    averageGrade: 8.5,
    hoursStudied: 45,
    certificatesEarned: 8,
    nextGoalProgress: 75
  };

  const recentActivities = [
    {
      type: 'course_completed',
      title: 'JavaScript Avançado',
      time: '2 horas atrás',
      points: 100
    },
    {
      type: 'quiz_passed',
      title: 'Quiz React Hooks',
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

  const currentCourses = [
    {
      id: 1,
      title: 'Python para Data Science',
      progress: 65,
      nextLesson: 'Manipulação de DataFrames',
      timeRemaining: '2h 30min'
    },
    {
      id: 2,
      title: 'Design Thinking',
      progress: 30,
      nextLesson: 'Prototipagem Rápida',
      timeRemaining: '4h 15min'
    },
    {
      id: 3,
      title: 'Liderança e Gestão',
      progress: 80,
      nextLesson: 'Feedback Efetivo',
      timeRemaining: '1h 45min'
    }
  ];

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
                    <p className="text-2xl font-bold text-gray-900">{studentStats.hoursStudied}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Média de Notas</p>
                    <p className="text-2xl font-bold text-gray-900">{studentStats.averageGrade}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Current Courses - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Cursos em Andamento
                  </CardTitle>
                  <CardDescription>
                    Continue de onde parou
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentCourses.map((course) => (
                    <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <Badge variant="outline">{course.progress}%</Badge>
                      </div>
                      <Progress value={course.progress} className="mb-3" />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Próxima: {course.nextLesson}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.timeRemaining}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Progresso Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Gráfico de progresso semanal</p>
                  </div>
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
                      <p className="text-xs font-medium">10 Cursos</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs font-medium">Meta Mensal</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs font-medium">Nota Máxima</p>
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
