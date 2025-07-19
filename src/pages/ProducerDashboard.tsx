import { useState, useEffect } from 'react';
import { useCourses } from "@/hooks/useCourses";
import { useCompanies } from "@/hooks/useCompanies";
import { useCompaniesWithPlans } from "@/hooks/useCompaniesWithPlans";
import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Building2, 
  Users, 
  BarChart3, 
  Plus, 
  MessageSquare,
  FileText,
  Settings,
  Calendar,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

const ProducerDashboard = () => {
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: companiesWithPlans = [], isLoading: plansLoading } = useCompaniesWithPlans();
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate real statistics from actual data
  const publishedCourses = courses.filter(course => course.is_published);
  const totalCourses = courses.length;
  const totalCompanies = companies.length;
  const activeCompanies = companiesWithPlans.filter(company => company.subscription_status === 'active').length;
  const totalCollaborators = companiesWithPlans.reduce((sum, company) => sum + (company.current_collaborators || 0), 0);

  // Header content com botão de criar curso
  const headerContent = (
    <>
      <Badge className="bg-green-100 text-green-700">
        Status: Ativo
      </Badge>
      <Link to="/producer/courses/new">
        <Button className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Criar Novo Curso
        </Button>
      </Link>
    </>
  );

  if (isLoading || coursesLoading || companiesLoading || plansLoading) {
    return (
      <PageLayout
        title="Painel do Produtor"
        subtitle="Carregando dados..."
      >
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Painel do Produtor"
      subtitle="Bem-vindo de volta! Gerencie seus cursos e empresas clientes."
      headerContent={headerContent}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cursos Publicados</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedCourses.length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Empresas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCompanies}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Colaboradores</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCollaborators}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cursos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-500">{course.description?.substring(0, 100)}...</p>
                        </div>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Publicado" : "Rascunho"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum curso encontrado. Crie seu primeiro curso!
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análise de Desempenho</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analytics em Desenvolvimento
                  </h3>
                  <p className="text-gray-600">
                    Os dados de análise estarão disponíveis em breve
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3 text-center" asChild>
                    <Link to="/producer/courses/new">
                      <BookOpen className="h-8 w-8 mb-2 text-blue-600" />
                      <div>
                        <div className="font-medium">Novo Curso</div>
                        <div className="text-xs text-muted-foreground mt-1">Criar um novo curso</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3 text-center" asChild>
                    <Link to="/producer/companies/new">
                      <Building2 className="h-8 w-8 mb-2 text-purple-600" />
                      <div>
                        <div className="font-medium">Nova Empresa</div>
                        <div className="text-xs text-muted-foreground mt-1">Adicionar uma nova empresa</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3 text-center" asChild>
                    <Link to="/producer/mentorship/new">
                      <MessageSquare className="h-8 w-8 mb-2 text-green-600" />
                      <div>
                        <div className="font-medium">Nova Mentoria</div>
                        <div className="text-xs text-muted-foreground mt-1">Agendar uma mentoria</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6 gap-3 text-center" asChild>
                    <Link to="/producer/profile">
                      <Settings className="h-8 w-8 mb-2 text-gray-600" />
                      <div>
                        <div className="font-medium">Configurações</div>
                        <div className="text-xs text-muted-foreground mt-1">Ajustar configurações</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Atividades em Desenvolvimento
                  </h3>
                  <p className="text-gray-600">
                    O histórico de atividades estará disponível em breve
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Desempenho</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cursos Publicados</span>
                    <span className="font-medium">{publishedCourses.length} de {totalCourses}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-calmon-500 h-2.5 rounded-full" 
                      style={{ width: `${totalCourses > 0 ? (publishedCourses.length / totalCourses) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Empresas Ativas</span>
                    <span className="font-medium">{activeCompanies} de {totalCompanies}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${totalCompanies > 0 ? (activeCompanies / totalCompanies) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProducerDashboard;