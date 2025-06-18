
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { useCommunityTopics } from '@/hooks/useCommunityTopics';
import { CreateTopicDialog } from '@/components/community/CreateTopicDialog';
import { EditTopicDialog } from '@/components/community/EditTopicDialog';
import { TopicCard } from '@/components/community/TopicCard';
import type { CommunityTopic } from '@/hooks/useCommunityTopics';

const StudentCommunity = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<CommunityTopic | null>(null);

  const { data: topics = [], isLoading } = useCommunityTopics();

  // Filter topics based on search and category
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(topics.map(topic => topic.category)));

  // Sort topics: pinned first, then by creation date
  const sortedTopics = filteredTopics.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-calmon-gradient px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Comunidade</h1>
            <p className="text-calmon-100">Conecte-se com outros estudantes e tire suas dúvidas</p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Tópico
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
            <Input
              placeholder="Buscar tópicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 backdrop-blur-sm"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white backdrop-blur-sm">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-calmon-bg-gradient">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calmon-600 mx-auto mb-2"></div>
              <p className="text-calmon-600">Carregando tópicos...</p>
            </div>
          </div>
        ) : sortedTopics.length > 0 ? (
          <div className="space-y-4">
            {sortedTopics.map(topic => (
              <div key={topic.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                <TopicCard 
                  topic={topic} 
                  onEdit={setEditingTopic}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
            <Card className="border-0 bg-transparent">
              <CardContent className="p-8 text-center">
                <div className="text-calmon-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-calmon-900 mb-2">Nenhum tópico encontrado</h3>
                <p className="text-calmon-600 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Seja o primeiro a iniciar uma discussão na comunidade!'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)} 
                    className="mt-2 bg-calmon-600 hover:bg-calmon-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Tópico
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateTopicDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
      
      {editingTopic && (
        <EditTopicDialog 
          topic={editingTopic}
          open={!!editingTopic}
          onOpenChange={(open) => !open && setEditingTopic(null)}
        />
      )}
    </div>
  );
};

export default StudentCommunity;
