
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Edit, Trash2, Play } from "lucide-react";
import { CourseModule } from "@/hooks/useCourseModules";

interface ModulesTabContentProps {
  modules: CourseModule[];
  onCreateModule: () => void;
  onEditModule: (module: CourseModule) => void;
}

export const ModulesTabContent = ({ modules, onCreateModule, onEditModule }: ModulesTabContentProps) => {
  console.log('[ModulesTabContent] Modules received:', modules);

  if (modules.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum módulo criado</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando o primeiro módulo do seu curso.
          </p>
          <Button 
            onClick={onCreateModule}
            className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Módulo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Módulos do Curso</h3>
        <Button 
          onClick={onCreateModule}
          className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Módulo
        </Button>
      </div>
      
      <div className="grid gap-4">
        {modules.map((module) => {
          const lessonsCount = module.lessons?.length || 0;
          console.log(`[ModulesTabContent] Module ${module.title} has ${lessonsCount} lessons:`, module.lessons);
          
          return (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {module.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={module.is_published ? 'default' : 'outline'}>
                      {module.is_published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => onEditModule(module)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{lessonsCount} aulas</span>
                  </div>
                  <span>Ordem: {module.order_index}</span>
                </div>
                
                {/* Exibir as aulas do módulo se existirem */}
                {lessonsCount > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h5 className="text-sm font-medium mb-2">Aulas:</h5>
                    <div className="space-y-1">
                      {module.lessons?.map((lesson, index) => (
                        <div key={lesson.id} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                          {lesson.duration_minutes && (
                            <span className="text-xs">({lesson.duration_minutes}min)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
