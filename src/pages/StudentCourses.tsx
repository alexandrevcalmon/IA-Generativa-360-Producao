
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Clock,
  Users,
  Star,
  Play,
  Award,
  Filter
} from "lucide-react";

const StudentCourses = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meus Cursos</h1>
            <p className="text-calmon-100">
              Continue sua jornada de aprendizado
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <BookOpen className="w-3 h-3 mr-1" />
              0 cursos iniciados
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-calmon-bg-gradient">
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar cursos..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="tech">Tecnologia</SelectItem>
                  <SelectItem value="business">Negócios</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-lg">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todos os Cursos</TabsTrigger>
                <TabsTrigger value="progress">Em Progresso</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
                <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-calmon-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-calmon-800 mb-2">
                    Nenhum curso disponível
                  </h3>
                  <p className="text-calmon-600 mb-6">
                    Novos cursos serão disponibilizados em breve pela sua empresa.
                  </p>
                  <Button className="bg-calmon-600 hover:bg-calmon-700 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Explorar Cursos
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-calmon-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-calmon-800 mb-2">
                    Nenhum curso em progresso
                  </h3>
                  <p className="text-calmon-600">
                    Comece um curso para acompanhar seu progresso aqui.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-calmon-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-calmon-800 mb-2">
                    Nenhum curso concluído
                  </h3>
                  <p className="text-calmon-600">
                    Complete um curso para vê-lo aqui.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-calmon-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-calmon-800 mb-2">
                    Nenhum curso favorito
                  </h3>
                  <p className="text-calmon-600">
                    Marque cursos como favoritos para encontrá-los facilmente.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
