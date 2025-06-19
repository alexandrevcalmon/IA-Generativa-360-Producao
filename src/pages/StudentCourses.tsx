
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
  Filter,
  Grid,
  List
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useStudentCourses } from "@/hooks/useStudentCourses";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";

const StudentCourses = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data: courses, isLoading } = useStudentCourses();

  const categories = ["Todos", "IA Generativa", "Técnicas", "Bem-estar", "Desenvolvimento", "Ética", "Automação"];
  const levels = ["Todos os níveis", "Iniciante", "Intermediário", "Avançado"];

  const inProgressCourses = courses?.filter(c => c.progress_percentage > 0 && c.progress_percentage < 100) || [];
  const completedCourses = courses?.filter(c => c.progress_percentage === 100) || [];

  // Placeholder images for courses
  const placeholderImages = [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop"
  ];

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  const getImageUrl = (course: any, index: number) => {
    console.log('Course thumbnail URL:', course.thumbnail_url);
    console.log('Course title:', course.title);
    
    if (course.thumbnail_url) {
      return course.thumbnail_url;
    }
    
    return getPlaceholderImage(index);
  };

  const CourseCard = ({ course, isListView = false, index }: { course: any, isListView?: boolean, index: number }) => (
    <Card className={`hover-lift transition-all duration-200 ${isListView ? 'flex flex-col sm:flex-row' : ''}`}>
      <div className={`${isListView ? 'w-full sm:w-48 flex-shrink-0' : 'w-full'}`}>
        <div className={`relative ${isListView ? 'h-48 sm:h-32' : 'h-48'} overflow-hidden ${isListView ? 'rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none' : 'rounded-t-lg'}`}>
          <img 
            src={getImageUrl(course, index)}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image failed to load, falling back to placeholder');
              e.currentTarget.src = getPlaceholderImage(index);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', course.thumbnail_url || 'placeholder');
            }}
          />
          {course.progress_percentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              {course.progress_percentage === 100 ? 'Concluído' : `${Math.round(course.progress_percentage)}%`}
            </Badge>
          )}
        </div>
      </div>
      
      <div className={`${isListView ? 'flex-1' : ''}`}>
        <CardHeader className={`p-4 ${isListView ? 'pb-2' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={`${isListView ? 'text-lg' : 'text-xl'} mb-2 line-clamp-2`}>
                {course.title}
              </CardTitle>
              <CardDescription className={`${isListView ? 'line-clamp-2' : 'line-clamp-3'} mb-3 text-sm`}>
                {course.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">{course.category}</Badge>
            <Badge variant="outline" className="text-xs">{course.difficulty_level}</Badge>
          </div>
        </CardHeader>

        <CardContent className={`p-4 pt-0 ${isListView ? '' : ''}`}>
          <div className={`${isListView ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4' : 'space-y-3'}`}>
            <div className={`${isListView ? 'flex flex-wrap gap-4 text-sm' : 'space-y-2 text-sm'}`}>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {course.estimated_hours}h
              </div>
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-4 w-4 mr-1" />
                {course.modules?.length || 0} módulos
              </div>
              <Badge variant="outline" className="text-xs">
                {course.difficulty_level}
              </Badge>
            </div>
            
            <div className={`${isListView ? 'flex items-center gap-2' : 'flex justify-between items-center'}`}>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
                <Link to={`/student/courses/${course.id}`}>
                  {course.progress_percentage > 0 ? 'Continuar' : 'Começar Curso'}
                </Link>
              </Button>
            </div>
          </div>
          
          {course.progress_percentage > 0 && course.progress_percentage < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span>{Math.round(course.progress_percentage)}%</span>
              </div>
              <Progress value={course.progress_percentage} className="h-2" />
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <StudentPageHeader
          title="Catálogo de Cursos"
          subtitle="Carregando..."
        />
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando cursos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <StudentPageHeader
        title="Catálogo de Cursos"
        subtitle="Explore nossa biblioteca completa de conhecimento"
      >
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </StudentPageHeader>

      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar cursos, instrutores ou tópicos..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select defaultValue="Todos">
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="Todos os níveis">
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
                <TabsTrigger value="bookmarked">Favoritos</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {courses?.length || 0} cursos disponíveis
                </h2>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="popular">Mais Populares</SelectItem>
                    <SelectItem value="rating">Melhor Avaliados</SelectItem>
                    <SelectItem value="duration">Duração</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {courses && courses.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                  {courses.map((course, index) => (
                    <CourseCard key={course.id} course={course} isListView={viewMode === 'list'} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum curso disponível
                  </h3>
                  <p className="text-gray-600">
                    Novos cursos serão adicionados em breve
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {inProgressCourses.length} cursos em andamento
                </h2>
              </div>

              <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                {inProgressCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} isListView={viewMode === 'list'} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {completedCourses.length} cursos concluídos
                </h2>
              </div>

              <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                {completedCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} isListView={viewMode === 'list'} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookmarked" className="space-y-6">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum curso favoritado ainda
                </h3>
                <p className="text-gray-600 mb-4">
                  Marque cursos como favoritos para acessá-los rapidamente
                </p>
                <Button variant="outline">
                  Explorar Cursos
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
