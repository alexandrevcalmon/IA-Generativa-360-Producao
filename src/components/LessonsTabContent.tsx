
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff, GripVertical } from "lucide-react";
import { CourseModule, useUpdateModuleOrder } from "@/hooks/useCourseModules";
import { useLessons, Lesson, useUpdateLessonOrder } from "@/hooks/useLessons";
import { DraggableLessonItem } from "@/components/DraggableLessonItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface LessonsTabContentProps {
  modules: CourseModule[];
  onEditLesson: (lesson: Lesson) => void;
  onCreateLesson: (moduleId: string) => void;
}

const ModuleLessonsSection = ({ 
  module, 
  index,
  onEditLesson, 
  onCreateLesson 
}: {
  module: CourseModule;
  index: number;
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
    <Draggable draggableId={`module-${module.id}`} index={index}>
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  {...provided.dragHandleProps}
                  className="flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                >
                  <GripVertical className="h-5 w-5" />
                </div>
                
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
      )}
    </Draggable>
  );
};

export const LessonsTabContent = ({ 
  modules, 
  onEditLesson, 
  onCreateLesson 
}: LessonsTabContentProps) => {
  const updateModuleOrder = useUpdateModuleOrder();

  const handleModuleDragEnd = async (result: any) => {
    if (!result.destination) return;
    if (result.type !== 'module') return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const reorderedModules = Array.from(modules);
    const [removed] = reorderedModules.splice(sourceIndex, 1);
    reorderedModules.splice(destinationIndex, 0, removed);

    // Atualizar as ordens no banco
    const updates = reorderedModules.map((module, index) => ({
      id: module.id,
      order_index: index,
    }));

    if (modules.length > 0) {
      await updateModuleOrder.mutateAsync({ courseId: modules[0].course_id, modules: updates });
    }
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleModuleDragEnd}>
        <Droppable droppableId="modules-lessons-tab" type="module">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {modules.map((module, index) => (
                <ModuleLessonsSection 
                  key={module.id} 
                  module={module}
                  index={index}
                  onEditLesson={onEditLesson}
                  onCreateLesson={onCreateLesson}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
