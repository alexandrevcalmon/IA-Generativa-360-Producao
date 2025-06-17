
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Brain,
  Plus,
  Building2,
  CreditCard,
  MessageCircle,
  Trophy,
  BarChart3,
  Upload,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";

const ProducerDashboard = () => {
  const { data: courses = [], isLoading } = useCourses();

  // Calculate real statistics from actual data
  const publishedCourses = courses.filter(course => course.is_published);
  const totalCourses = courses.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel do Produtor</h1>
            <p className="text-gray-600">Bem-vindo de volta! Gerencie seus cursos e empresas clientes.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-700">
              Status: Ativo
            </Badge>
            <Link to="/producer/courses">
              <Button className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Curso
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cursos Criados
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedCourses.length} publicados
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Empresas Clientes
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Nenhuma empresa cadastrada
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Colaboradores
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Nenhum colaborador
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 0,00</div>
                <p className="text-xs text-muted-foreground">
                  Sem vendas ainda
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-calmon-600" />
                      Meus Cursos
                    </div>
                    <Link to="/producer/courses">
                      <Button variant="outline" size="sm">
                        Ver Todos
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Gerencie e acompanhe o desempenho dos seus cursos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Carregando cursos...</p>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Você ainda não criou nenhum curso.</p>
                      <Link to="/producer/courses">
                        <Button className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Primeiro Curso
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="w-20 h-12 bg-gradient-to-r from-calmon-500 to-calmon-700 rounded flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {course.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{course.category || 'Sem categoria'}</span>
                              <Badge 
                                variant={course.is_published ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {course.is_published ? 'Publicado' : 'Rascunho'}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-calmon-600">
                              R$ 0,00
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Link to={`/producer/courses/${course.id}`}>
                                <Button size="sm" variant="outline">
                                  Ver
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Content Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Analytics de Conteúdo
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o desempenho e engajamento dos seus cursos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">-</div>
                      <div className="text-sm text-gray-600">Avaliação Média</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">-</div>
                      <div className="text-sm text-gray-600">Satisfação</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Avaliações</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/producer/courses" className="block">
                    <Button className="w-full justify-start bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Novo Curso
                    </Button>
                  </Link>
                  <Link to="/producer/companies" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Building2 className="h-4 w-4 mr-2" />
                      Gerenciar Empresas
                    </Button>
                  </Link>
                  <Link to="/producer/plans" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Gerenciar Planos
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload de Conteúdo
                  </Button>
                  <Button className="w-full justify-start" variant="outline" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Criar Material
                  </Button>
                  <Button className="w-full justify-start" variant="outline" disabled>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Suporte ao Aluno
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma atividade recente.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                    Desempenho da Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cursos Ativos</span>
                      <span className="font-medium">{publishedCourses.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Empresas Ativas</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Colaboradores Ativos</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taxa de Conclusão</span>
                      <span className="font-medium text-green-600">-</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Avaliação Geral</span>
                        <Badge className="bg-yellow-100 text-yellow-700">-</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
