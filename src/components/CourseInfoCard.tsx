import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";
import { Course } from "@/hooks/useCourses";
import { CourseModule } from "@/hooks/useCourseModules";

interface CourseInfoCardProps {
  course: Course;
  modules: CourseModule[];
}

export const CourseInfoCard = ({ course, modules }: CourseInfoCardProps) => {
  return (
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
  );
};
