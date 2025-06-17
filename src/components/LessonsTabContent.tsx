
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CourseModule } from "@/hooks/useCourseModules";
import { useLessons, Lesson } from "@/hooks/useLessons";
import { LessonItem } from "@/components/LessonItem";

interface LessonsTabContentProps {
  modules: CourseModule[];
  onEditLesson: (lesson: Lesson) => void;
  onCreateLesson: (moduleId: string) => void;
}

const ModuleLessonsSection = ({ 
  module, 
  onEditLesson, 
  onCreateLesson 
}: {
  module: CourseModule;
  onEditLesson: (lesson: Lesson) => void;
  onCreateLesson: (moduleId: string) => void;
}) => {
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
            {lessons.map((lesson: Lesson, index: number) => (
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

export const LessonsTabContent = ({ 
  modules, 
  onEditLesson, 
  onCreateLesson 
}: LessonsTabContentProps) => {
  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <ModuleLessonsSection 
          key={module.id} 
          module={module} 
          onEditLesson={onEditLesson}
          onCreateLesson={onCreateLesson}
        />
      ))}
    </div>
  );
};
