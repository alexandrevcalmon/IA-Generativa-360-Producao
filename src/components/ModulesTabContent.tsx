
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { CourseModule, useUpdateModuleOrder } from "@/hooks/useCourseModules";
import { DraggableModuleCard } from "@/components/DraggableModuleCard";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

interface ModulesTabContentProps {
  modules: CourseModule[];
  onCreateModule: () => void;
  onEditModule: (module: CourseModule) => void;
}

export const ModulesTabContent = ({ 
  modules, 
  onCreateModule, 
  onEditModule 
}: ModulesTabContentProps) => {
  const updateModuleOrder = useUpdateModuleOrder();

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

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
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="modules" type="module">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {modules.map((module, index) => (
              <DraggableModuleCard
                key={module.id}
                module={module}
                index={index}
                onEdit={onEditModule}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
