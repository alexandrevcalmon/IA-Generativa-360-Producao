import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { PageSection } from '@/components/PageSection';
import { StatsGrid, type StatItem } from '@/components/StatsGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Users,
  Search,
  Plus,
  Pin,
  ThumbsUp,
  Filter,
  Eye,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import {
  useCommunityTopics,
  type CommunityTopic
} from '@/hooks/useCommunityTopics';
import { CreateTopicDialog } from '@/components/community/CreateTopicDialog';
import { TopicCard } from '@/components/community/TopicCard';
import { EditTopicDialog } from '@/components/community/EditTopicDialog';

const ProducerCommunity = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [createTopicOpen, setCreateTopicOpen] = useState(false);
  const [editTopicOpen, setEditTopicOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(null);

  const { data: topics = [], isLoading, error } = useCommunityTopics();

  const handleEditTopic = (topic: CommunityTopic) => {
    setSelectedTopic(topic);
    setEditTopicOpen(true);
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const communityStats = {
    totalTopics: topics.length,
    totalReplies: topics.reduce((sum, topic) => sum + topic.replies_count, 0),
    totalLikes: topics.reduce((sum, topic) => sum + topic.likes_count, 0),
    totalViews: topics.reduce((sum, topic) => sum + topic.views_count, 0),
  };

  // Stats para o StatsGrid
  const statsItems: StatItem[] = [
    {
      title: "Total de Tópicos",
      value: communityStats.totalTopics,
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total de Respostas",
      value: communityStats.totalReplies,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total de Curtidas",
      value: communityStats.totalLikes,
      icon: ThumbsUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total de Visualizações",
      value: communityStats.totalViews,
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // Header content com botão de criar tópico
  const headerContent = (
    <Button 
      className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
      onClick={() => setCreateTopicOpen(true)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Novo Tópico
    </Button>
  );

  if (isLoading) {
    return (
      <PageLayout
        title="Gerenciar Comunidade"
        subtitle="Carregando dados..."
      >
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Gerenciar Comunidade"
        subtitle="Erro ao carregar dados"
      >
        <PageSection>
          <div className="flex flex-col items-center justify-center p-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar comunidade
            </h3>
            <p className="text-gray-600">
              Tente recarregar a página ou entre em contato com o suporte.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        </PageSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gerenciar Comunidade"
      subtitle="Modere discussões, fixe tópicos importantes e acompanhe a atividade"
      headerContent={headerContent}
    >
      <div className="space-y-6">
        {/* Estatísticas */}
        <StatsGrid stats={statsItems} />

        {/* Filtros e Busca */}
        <PageSection>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tópicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
        </PageSection>

        {/* Lista de Tópicos */}
        <PageSection>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pinned">Fixados</TabsTrigger>
              <TabsTrigger value="recent">Recentes</TabsTrigger>
              <TabsTrigger value="trending">Em Alta</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onEdit={handleEditTopic}
                    showModeratorActions={true}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum tópico encontrado
                    </h3>
                    <p className="text-gray-600">
                      Quando os colaboradores criarem tópicos, eles aparecerão aqui.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pinned" className="space-y-4">
              {filteredTopics.filter(topic => topic.is_pinned).length > 0 ? (
                filteredTopics.filter(topic => topic.is_pinned).map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onEdit={handleEditTopic}
                    showModeratorActions={true}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Pin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum tópico fixado
                    </h3>
                    <p className="text-gray-600">
                      Use a opção de fixar para destacar tópicos importantes.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Em desenvolvimento
                  </h3>
                  <p className="text-gray-600">
                    Funcionalidade em desenvolvimento.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Em desenvolvimento
                  </h3>
                  <p className="text-gray-600">
                    Funcionalidade em desenvolvimento.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </PageSection>
      </div>

      <CreateTopicDialog 
        open={createTopicOpen} 
        onOpenChange={setCreateTopicOpen} 
      />
      
      <EditTopicDialog 
        open={editTopicOpen} 
        onOpenChange={setEditTopicOpen} 
        topic={selectedTopic}
      />
    </PageLayout>
  );
};

export default ProducerCommunity;