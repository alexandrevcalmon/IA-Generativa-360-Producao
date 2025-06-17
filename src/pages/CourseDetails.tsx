
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, BookOpen, Play, Settings, Users } from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useCourseModules, CourseModule } from "@/hooks/useCourseModules";
import { CreateModuleDialog } from "@/components/CreateModuleDialog";
import { ModuleCard } from "@/components/ModuleCard";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [createModuleDialogOpen, setCreateModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  const { data: course, isLoading: courseLoading } = useCourse(courseId!);
  const { data: modules = [], isLoading: modulesLoading } = useCourseModules(courseId!);

  if (!courseId) {
    return <div>Curso não encontrado</div>;
  }

  if (courseLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
          </div>
        </header>
        <div className="flex-1 p-6 bg-gray-50">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2].map((i) => (
                <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
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
            <Button variant="ghost" onClick={() => navigate("/producer/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Curso não encontrado</h1>
          </div>
        </header>
      </div>
    );
  }

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setCreateModuleDialogOpen(true);
  };

  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons_count || 0), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <Button variant="ghost" onClick={() => navigate("/producer/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600">{course.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button 
              onClick={() => {
                setEditingModule(null);
                setCreateModuleDialogOpen(true);
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
          {/* Course Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações do Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.thumbnail_url && (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={course.is_published ? "default" : "outline"}>
                    {course.is_published ? "Publicado" : "Rascunho"}
                  </Badge>
                  {course.difficulty_level && (
                    <Badge variant="secondary">
                      {course.difficulty_level === 'beginner' ? 'Iniciante' : 
                       course.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </Badge>
                  )}
                  {course.estimated_hours && (
                    <Badge variant="outline">{course.estimated_hours}h</Badge>
                  )}
                </div>

                {course.description && (
                  <p className="text-gray-700">{course.description}</p>
                )}

                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Módulos</span>
                  </div>
                  <span className="font-semibold">{modules.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Aulas</span>
                  </div>
                  <span className="font-semibold">{totalLessons}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Alunos</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modules" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="modules">Módulos</TabsTrigger>
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="modules" className="space-y-4">
                  {modulesLoading ? (
                    <div className="space-y-4">
                      {[1,2,3].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                      ))}
                    </div>
                  ) : modules.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum módulo encontrado</h3>
                      <p className="text-muted-foreground mb-4">
                        Comece criando o primeiro módulo do seu curso.
                      </p>
                      <Button 
                        onClick={() => setCreateModuleDialogOpen(true)}
                        className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Módulo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
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
                
                <TabsContent value="settings">
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Configurações do Curso</h3>
                    <p className="text-muted-foreground">
                      Funcionalidade em desenvolvimento.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateModuleDialog 
        isOpen={createModuleDialogOpen} 
        onClose={() => {
          setCreateModuleDialogOpen(false);
          setEditingModule(null);
        }}
        courseId={courseId}
        module={editingModule}
      />
    </div>
  );
};

export default CourseDetails;
