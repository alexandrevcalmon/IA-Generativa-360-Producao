
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Award,
  Calendar,
  Activity
} from "lucide-react";

const StudentAnalytics = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meu Progresso</h1>
            <p className="text-calmon-100">Acompanhe seu desenvolvimento e estatísticas de aprendizagem</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-calmon-bg-gradient">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <Card className="border-0 bg-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-calmon-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-calmon-600">Cursos Iniciados</p>
                      <p className="text-2xl font-bold text-calmon-900">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <Card className="border-0 bg-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-calmon-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-calmon-600">Cursos Concluídos</p>
                      <p className="text-2xl font-bold text-calmon-900">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <Card className="border-0 bg-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-calmon-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-calmon-600">Horas de Estudo</p>
                      <p className="text-2xl font-bold text-calmon-900">0h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              <Card className="border-0 bg-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-calmon-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-calmon-600">Meta Semanal</p>
                      <p className="text-2xl font-bold text-calmon-900">0%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-lg">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="time">Tempo de Estudo</TabsTrigger>
                <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                  <Card className="border-0 bg-transparent">
                    <CardHeader>
                      <CardTitle className="flex items-center text-calmon-800">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Progresso Semanal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-calmon-400 mx-auto mb-4" />
                        <p className="text-calmon-600">
                          Dados de progresso aparecerão aqui quando você começar a estudar
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                  <Card className="border-0 bg-transparent">
                    <CardHeader>
                      <CardTitle className="flex items-center text-calmon-800">
                        <Activity className="h-5 w-5 mr-2" />
                        Atividade Recente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-calmon-400 mx-auto mb-4" />
                        <p className="text-calmon-600">
                          Sua atividade de aprendizagem será exibida aqui
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-calmon-800">Progresso dos Cursos</CardTitle>
                    <CardDescription className="text-calmon-600">
                      Acompanhe seu progresso em cada curso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-calmon-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-calmon-900 mb-2">
                        Nenhum curso iniciado
                      </h3>
                      <p className="text-calmon-600">
                        Comece um curso para ver seu progresso aqui
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="time" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-calmon-800">Tempo de Estudo</CardTitle>
                    <CardDescription className="text-calmon-600">
                      Análise detalhada do seu tempo dedicado aos estudos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-calmon-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-calmon-900 mb-2">
                        Nenhum tempo registrado
                      </h3>
                      <p className="text-calmon-600">
                        Seus dados de tempo de estudo aparecerão aqui
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-calmon-800">Conquistas e Badges</CardTitle>
                    <CardDescription className="text-calmon-600">
                      Suas conquistas e marcos de aprendizagem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Award className="h-12 w-12 text-calmon-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-calmon-900 mb-2">
                        Nenhuma conquista ainda
                      </h3>
                      <p className="text-calmon-600">
                        Complete lições e cursos para desbloquear conquistas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
