
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Users,
  Search,
  Plus,
  Calendar,
  MapPin,
  Star,
  Filter
} from "lucide-react";

const StudentCommunity = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comunidade</h1>
            <p className="text-gray-600">Conecte-se, aprenda e compartilhe conhecimento</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Discussão
            </Button>
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
                      placeholder="Buscar discussões, eventos ou pessoas..."
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

          {/* Community Tabs */}
          <Tabs defaultValue="discussions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="discussions">Discussões</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="members">Membros</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="discussions" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Discussion Feed */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhuma discussão encontrada
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Seja o primeiro a iniciar uma discussão na comunidade
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Discussão
                    </Button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Top Contributors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        Top Colaboradores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-6">
                        <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Ainda não há colaboradores ativos
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Community Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Estatísticas da Comunidade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Membros Ativos</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Discussões</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Respostas</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Eventos este mês</span>
                        <span className="font-semibold">0</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum evento agendado
                </h3>
                <p className="text-gray-600 mb-4">
                  Eventos da comunidade aparecerão aqui quando disponíveis
                </p>
                <Button variant="outline">
                  Sugerir Evento
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Membros da Comunidade
                </h3>
                <p className="text-gray-600 mb-4">
                  Conecte-se com outros profissionais e estudantes
                </p>
                <Button variant="outline">
                  Explorar Membros
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recursos da Comunidade
                </h3>
                <p className="text-gray-600 mb-4">
                  Materiais compartilhados pela comunidade
                </p>
                <Button variant="outline">
                  Ver Recursos
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentCommunity;
