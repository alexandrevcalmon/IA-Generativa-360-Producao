
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
  ThumbsUp,
  MessageSquare,
  Share2,
  Calendar,
  MapPin,
  Star,
  Filter
} from "lucide-react";

const StudentCommunity = () => {
  const discussions = [
    {
      id: 1,
      title: "Como otimizar prompts para GPT-4?",
      author: "Ana Silva",
      avatar: "/api/placeholder/32/32",
      category: "Prompt Engineering",
      replies: 23,
      likes: 45,
      timeAgo: "2 horas atrás",
      isAnswered: true,
      excerpt: "Estou tendo dificuldades para criar prompts mais eficientes..."
    },
    {
      id: 2,
      title: "Melhores práticas para fine-tuning",
      author: "Carlos Santos",
      avatar: "/api/placeholder/32/32",
      category: "Modelos de IA",
      replies: 18,
      likes: 32,
      timeAgo: "5 horas atrás",
      isAnswered: false,
      excerpt: "Quais são as principais considerações ao fazer fine-tuning?"
    },
    {
      id: 3,
      title: "Ética em IA: casos práticos",
      author: "Maria Costa",
      avatar: "/api/placeholder/32/32",
      category: "Ética",
      replies: 41,
      likes: 78,
      timeAgo: "1 dia atrás",
      isAnswered: true,
      excerpt: "Vamos discutir casos reais onde a ética em IA é fundamental..."
    }
  ];

  const events = [
    {
      id: 1,
      title: "Workshop: Prompt Engineering Avançado",
      date: "25 Jun 2024",
      time: "19:00",
      location: "Online",
      attendees: 45,
      maxAttendees: 60,
      type: "workshop"
    },
    {
      id: 2,
      title: "Meetup: Futuro da IA Generativa",
      date: "30 Jun 2024",
      time: "14:00",
      location: "São Paulo - SP",
      attendees: 28,
      maxAttendees: 40,
      type: "meetup"
    },
    {
      id: 3,
      title: "Hackathon: IA para Educação",
      date: "05 Jul 2024",
      time: "09:00",
      location: "Online",
      attendees: 156,
      maxAttendees: 200,
      type: "hackathon"
    }
  ];

  const topContributors = [
    {
      id: 1,
      name: "Dr. João Pereira",
      avatar: "/api/placeholder/40/40",
      title: "Especialista em IA",
      points: 2456,
      badge: "Expert"
    },
    {
      id: 2,
      name: "Ana Rodrigues",
      avatar: "/api/placeholder/40/40",
      title: "ML Engineer",
      points: 1832,
      badge: "Mentor"
    },
    {
      id: 3,
      name: "Carlos Lima",
      avatar: "/api/placeholder/40/40",
      title: "Data Scientist",
      points: 1567,
      badge: "Colaborador"
    }
  ];

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
                  {discussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={discussion.avatar} />
                            <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                {discussion.title}
                              </h3>
                              {discussion.isAnswered && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Respondido
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{discussion.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>por {discussion.author}</span>
                                <Badge variant="outline">{discussion.category}</Badge>
                                <span>{discussion.timeAgo}</span>
                              </div>
                              <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {discussion.likes}
                                </div>
                                <div className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  {discussion.replies}
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                    <CardContent className="space-y-4">
                      {topContributors.map((contributor, index) => (
                        <div key={contributor.id} className="flex items-center space-x-3">
                          <div className="text-sm font-medium text-gray-500 w-6">
                            #{index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contributor.avatar} />
                            <AvatarFallback>{contributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                            <p className="text-xs text-gray-500">{contributor.title}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{contributor.badge}</Badge>
                            <p className="text-xs text-gray-500 mt-1">{contributor.points} pts</p>
                          </div>
                        </div>
                      ))}
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
                        <span className="font-semibold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Discussões</span>
                        <span className="font-semibold">3,456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Respostas</span>
                        <span className="font-semibold">12,890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Eventos este mês</span>
                        <span className="font-semibold">8</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {event.type}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {event.attendees}/{event.maxAttendees} participantes
                        </div>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.date} às {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {event.attendees} confirmados
                        </div>
                        <Button className="w-full mt-4">
                          Participar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
