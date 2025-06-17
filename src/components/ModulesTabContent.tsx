
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { CourseModule } from "@/hooks/useCourseModules";
import { ModuleCard } from "@/components/ModuleCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {modules.map((module, index) => (
        <ModuleCard
          key={module.id}
          module={module}
          index={index}
          onEdit={onEditModule}
        />
      ))}
    </div>
  );
};
