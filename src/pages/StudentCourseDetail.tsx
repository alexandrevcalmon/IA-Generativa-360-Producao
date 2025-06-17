
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle, 
  Lock,
  Award,
  Users
} from 'lucide-react';
import { useStudentCourse } from '@/hooks/useStudentCourses';
import { useMarkLessonComplete } from '@/hooks/useStudentProgress';

const StudentCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useStudentCourse(courseId!);
  const markCompleteMutation = useMarkLessonComplete();

  const handleLessonComplete = async (lessonId: string) => {
    try {
      await markCompleteMutation.mutateAsync(lessonId);
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  const handleWatchLesson = (lessonId: string) => {
    navigate(`/student/courses/${courseId}/lessons/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/student/courses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/student/courses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Curso não encontrado</h1>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Curso não encontrado</h3>
              <p className="text-gray-600">
                O curso solicitado não foi encontrado ou não está disponível.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = course.modules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.completed).length, 0
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/student/courses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600">
                {course.modules.length} módulos • {totalLessons} lições
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {course.progress_percentage === 100 && (
              <Badge className="bg-amber-500 text-white">
                <Award className="w-3 h-3 mr-1" />
                Concluído
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-base">
                    {course.description}
                  </CardDescription>
                </div>
                <div className="ml-6 w-48 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{course.estimated_hours}h de conteúdo</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{totalLessons} lições</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Nível {course.difficulty_level}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progresso do Curso</span>
                  <span className="text-sm text-gray-600">
                    {completedLessons}/{totalLessons} lições ({Math.round(course.progress_percentage)}%)
                  </span>
                </div>
                <Progress value={course.progress_percentage} className="h-3" />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline">{course.difficulty_level}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Course Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Conteúdo do Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-2">
                {course.modules.map((module, moduleIndex) => (
                  <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {moduleIndex + 1}
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-gray-600">
                              {module.lessons.length} lições
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {module.lessons.filter(l => l.completed).length}/{module.lessons.length} concluídas
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 flex items-center justify-center">
                                {lesson.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : lesson.is_free ? (
                                  <Play className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Play className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{lesson.title}</h4>
                                {lesson.duration_minutes && (
                                  <p className="text-xs text-gray-500">
                                    {lesson.duration_minutes} min
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!lesson.completed && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleLessonComplete(lesson.id)}
                                  disabled={markCompleteMutation.isPending}
                                >
                                  Marcar como Concluída
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleWatchLesson(lesson.id)}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                {lesson.completed ? 'Revisar' : 'Assistir'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetail;
