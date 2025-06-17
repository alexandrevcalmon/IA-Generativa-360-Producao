
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
import { CourseModule } from "@/hooks/useCourseModules";
import { useLessons, Lesson, useUpdateLessonOrder } from "@/hooks/useLessons";
import { DraggableLessonItem } from "@/components/DraggableLessonItem";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: lessons = [] } = useLessons(module.id);
  const updateLessonOrder = useUpdateLessonOrder();

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const reorderedLessons = Array.from(lessons);
    const [removed] = reorderedLessons.splice(sourceIndex, 1);
    reorderedLessons.splice(destinationIndex, 0, removed);

    // Atualizar as ordens no banco
    const updates = reorderedLessons.map((lesson, index) => ({
      id: lesson.id,
      order_index: index,
    }));

    await updateLessonOrder.mutateAsync({ moduleId: module.id, lessons: updates });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{module.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
              title={isExpanded ? "Ocultar aulas" : "Mostrar aulas"}
            >
              {isExpanded ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
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
      {isExpanded && (
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
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={`lessons-tab-${module.id}`} type="lesson">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {lessons.map((lesson: Lesson, index: number) => (
                      <DraggableLessonItem
                        key={lesson.id}
                        lesson={lesson}
                        index={index}
                        onEdit={onEditLesson}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      )}
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
