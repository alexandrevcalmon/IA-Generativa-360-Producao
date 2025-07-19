import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { PageSection } from '@/components/PageSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bot } from 'lucide-react';
import { useAIConfigurations, useCreateAIConfiguration, useUpdateAIConfiguration, useDeleteAIConfiguration, AIConfiguration } from '@/hooks/useAIConfigurations';
import { AIConfigurationCard } from '@/components/producer/AIConfigurationCard';
import { AIConfigurationDialog } from '@/components/producer/AIConfigurationDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ProducerAIConfigurations = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AIConfiguration | null>(null);
  const [deletingConfigId, setDeletingConfigId] = useState<string | null>(null);

  const { data: configurations = [], isLoading } = useAIConfigurations();
  const createMutation = useCreateAIConfiguration();
  const updateMutation = useUpdateAIConfiguration();
  const deleteMutation = useDeleteAIConfiguration();

  const handleSave = (configData: Partial<AIConfiguration>) => {
    if (editingConfig) {
      updateMutation.mutate(configData as AIConfiguration & { id: string });
    } else {
      createMutation.mutate(configData as Omit<AIConfiguration, 'id' | 'created_at' | 'updated_at'>);
    }
    setEditingConfig(null);
  };

  const handleEdit = (config: AIConfiguration) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingConfigId(id);
  };

  const confirmDelete = () => {
    if (deletingConfigId) {
      deleteMutation.mutate(deletingConfigId);
      setDeletingConfigId(null);
    }
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    updateMutation.mutate({ id, is_active: isActive });
  };

  const handleCreateNew = () => {
    setEditingConfig(null);
    setIsDialogOpen(true);
  };

  // Header content com botão de criar nova configuração
  const headerContent = (
    <Button onClick={handleCreateNew}>
      <Plus className="h-4 w-4 mr-2" />
      Nova Configuração
    </Button>
  );

  return (
    <PageLayout
      title="Configurações de IA"
      subtitle="Gerencie os provedores de IA e suas configurações para chatbots de lições"
      headerContent={headerContent}
    >
      {isLoading ? (
        <PageSection>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Carregando configurações...</p>
            </div>
          </div>
        </PageSection>
      ) : configurations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map((config) => (
            <AIConfigurationCard
              key={config.id}
              config={config}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <PageSection>
          <Card>
            <CardHeader className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle>Nenhuma configuração de IA encontrada</CardTitle>
              <CardDescription>
                Crie sua primeira configuração de IA para habilitar chatbots inteligentes nas lições
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-12">
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira configuração
              </Button>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {/* Configuration Dialog */}
      <AIConfigurationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        config={editingConfig}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingConfigId} onOpenChange={() => setDeletingConfigId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta configuração de IA? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default ProducerAIConfigurations;