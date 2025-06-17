
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
  Star
} from "lucide-react";

const StudentLearning = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trilhas de Aprendizado</h1>
            <p className="text-gray-600">Siga caminhos estruturados para dominar novas habilidades</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar trilhas de aprendizado..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Minhas Trilhas Atuais
              </CardTitle>
              <CardDescription>
                Trilhas que você está seguindo atualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma trilha iniciada
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece uma trilha de aprendizado para ver seu progresso aqui
                </p>
                <Button>
                  Explorar Trilhas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle>Trilhas Disponíveis</CardTitle>
              <CardDescription>
                Explore as trilhas de aprendizado disponíveis para sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma trilha disponível
                </h3>
                <p className="text-gray-600">
                  Trilhas de aprendizado aparecerão aqui quando forem criadas para sua empresa
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Popular Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Trilhas Populares
              </CardTitle>
              <CardDescription>
                As trilhas mais procuradas pelos colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ainda não há trilhas populares
                </h3>
                <p className="text-gray-600">
                  As trilhas mais acessadas aparecerão aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentLearning;
