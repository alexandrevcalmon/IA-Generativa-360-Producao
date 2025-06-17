import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Settings, Plus } from "lucide-react";
import { Course } from "@/hooks/useCourses";

interface CourseDetailsHeaderProps {
  course: Course;
  onNavigateBack: () => void;
  onCreateModule: () => void;
}

export const CourseDetailsHeader = ({ 
  course, 
  onNavigateBack, 
  onCreateModule 
}: CourseDetailsHeaderProps) => {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" onClick={onNavigateBack}>
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
            onClick={onCreateModule}
            className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Módulo
          </Button>
        </div>
      </div>
    </header>
  );
};
