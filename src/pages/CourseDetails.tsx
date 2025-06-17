
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Settings, BookOpen, Users, Clock } from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useCourseModules } from "@/hooks/useCourseModules";
import { useLessons } from "@/hooks/useLessons";
import { ModuleCard } from "@/components/ModuleCard";
import { CreateModuleDialog } from "@/components/CreateModuleDialog";
import { CreateLessonDialog } from "@/components/CreateLessonDialog";
import { LessonItem } from "@/components/LessonItem";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [createLessonOpen, setCreateLessonOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const { data: course, isLoading: courseLoading } = useCourse(courseId!);
  const { data: modules = [], isLoading: modulesLoading } = useCourseModules(courseId!);

  if (courseLoading || modulesLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map((i) => (
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
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <Button variant="ghost" size="sm" onClick={() => navigate('/producer/courses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Curso não encontrado</h3>
              <p className="text-muted-foreground">
                O curso solicitado não foi encontrado ou você não tem permissão para acessá-lo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCreateLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setCreateLessonOpen(true);
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    setCreateModuleOpen(true);
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedModuleId(lesson.module_id);
    setEditingLesson(lesson);
    setCreateLessonOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <Button variant="ghost" size="sm" onClick={() => navigate('/producer/courses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600">Gerenciar conteúdo do curso</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button 
              onClick={() => {
                setEditingModule(null);
                setCreateModuleOpen(true);
              }}
              className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Módulo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Course Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold">{course.title}</h2>
                    <Badge variant={course.is_published ? "default" : "secondary"}>
                      {course.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                  
                  {course.description && (
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{modules.length} módulos</span>
                    </div>
                    {course.estimated_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{course.estimated_hours}h estimadas</span>
                      </div>
                    )}
                    {course.category && (
                      <Badge variant="outline">{course.category}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules and Lessons */}
          <Tabs defaultValue="modules" className="w-full">
            <TabsList>
              <TabsTrigger value="modules">Módulos</TabsTrigger>
              <TabsTrigger value="lessons">Todas as Aulas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="space-y-4">
              {modules.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum módulo criado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece criando o primeiro módulo do seu curso.
                    </p>
                    <Button 
                      onClick={() => setCreateModuleOpen(true)}
                      className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Módulo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modules.map((module, index) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      index={index}
                      onEdit={handleEditModule}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="lessons" className="space-y-4">
              {modules.map((module) => (
                <ModuleLessonsSection 
                  key={module.id} 
                  module={module} 
                  onEditLesson={handleEditLesson}
                  onCreateLesson={handleCreateLesson}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateModuleDialog 
        isOpen={createModuleOpen} 
        onClose={() => {
          setCreateModuleOpen(false);
          setEditingModule(null);
        }}
        courseId={courseId!}
        module={editingModule}
      />

      <CreateLessonDialog
        isOpen={createLessonOpen}
        onClose={() => {
          setCreateLessonOpen(false);
          setEditingLesson(null);
          setSelectedModuleId(null);
        }}
        moduleId={selectedModuleId!}
        lesson={editingLesson}
      />
    </div>
  );
};

// Component to show lessons for a specific module
const ModuleLessonsSection = ({ module, onEditLesson, onCreateLesson }: any) => {
  const { data: lessons = [] } = useLessons(module.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{module.title}</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCreateLesson(module.id)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Aula
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Nenhuma aula criada neste módulo</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCreateLesson(module.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Aula
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson: any, index: number) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                index={index}
                onEdit={onEditLesson}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseDetails;
