
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  Pause,
  RotateCcw,
  Settings,
  Download,
  CheckCircle,
  Lock,
  FileText
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStudentCourse } from '@/hooks/useStudentCourses';
import { useUpdateLessonProgress } from '@/hooks/useStudentProgress';

const StudentLessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const { data: course, isLoading } = useStudentCourse(courseId!);
  const updateProgress = useUpdateLessonProgress();

  // Find the current lesson
  const currentLesson = course?.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === lessonId);

  // Find all lessons for navigation
  const allLessons = course?.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      ...lesson,
      moduleTitle: module.title
    }))
  ) || [];

  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === lessonId);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setWatchTime(video.currentTime);
      
      // Update progress every 10 seconds
      if (Math.floor(video.currentTime) % 10 === 0 && currentLesson) {
        updateProgress.mutate({
          lessonId: currentLesson.id,
          watchTimeSeconds: Math.floor(video.currentTime)
        });
      }
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentLesson, updateProgress]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMarkComplete = () => {
    if (currentLesson) {
      updateProgress.mutate({
        lessonId: currentLesson.id,
        completed: true,
        watchTimeSeconds: Math.floor(watchTime)
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/student/courses/${courseId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-600">Carregando aula...</div>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/student/courses/${courseId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Aula não encontrada</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Aula não encontrada</h3>
            <p className="text-gray-600">A aula solicitada não foi encontrada.</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (watchTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/student/courses/${courseId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Curso
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
              <p className="text-gray-600">{course?.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {currentLesson.completed && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Concluída
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-t-lg overflow-hidden">
                    {currentLesson.video_file_url ? (
                      <video
                        ref={videoRef}
                        className="w-full aspect-video"
                        controls
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        poster={course?.thumbnail_url || undefined}
                      >
                        <source src={currentLesson.video_file_url} type="video/mp4" />
                        Seu navegador não suporta vídeos HTML5.
                      </video>
                    ) : currentLesson.video_url ? (
                      <iframe
                        className="w-full aspect-video"
                        src={currentLesson.video_url}
                        title={currentLesson.title}
                        frameBorder="0"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center bg-gray-800 text-white">
                        <div className="text-center">
                          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p>Vídeo não disponível</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                      <div className="flex items-center space-x-2">
                        {currentLesson.duration_minutes && (
                          <span className="text-sm text-gray-600">
                            {currentLesson.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </div>

                    {currentLesson.content && (
                      <div className="prose max-w-none mb-6">
                        <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progresso da Aula</span>
                        <span className="text-sm text-gray-600">
                          {formatTime(watchTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {!currentLesson.completed && (
                        <Button 
                          onClick={handleMarkComplete}
                          disabled={updateProgress.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Concluída
                        </Button>
                      )}
                      
                      {currentLesson.material_url && (
                        <Button variant="outline" asChild>
                          <a href={currentLesson.material_url} download>
                            <FileText className="h-4 w-4 mr-2" />
                            Material de Apoio
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navegação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {prevLesson && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Aula Anterior
                    </Button>
                  )}
                  
                  {nextLesson && (
                    <Button 
                      className="w-full justify-start"
                      onClick={() => navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`)}
                    >
                      Próxima Aula
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progresso do Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Aulas concluídas</span>
                      <span>
                        {allLessons.filter(l => l.completed).length}/{allLessons.length}
                      </span>
                    </div>
                    <Progress 
                      value={course?.progress_percentage || 0} 
                      className="h-2" 
                    />
                    <p className="text-sm text-gray-600">
                      {Math.round(course?.progress_percentage || 0)}% do curso concluído
                    </p>
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

export default StudentLessonView;
