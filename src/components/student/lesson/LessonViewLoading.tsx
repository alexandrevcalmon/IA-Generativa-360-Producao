
import { PageLayout } from '@/components/PageLayout';

export const LessonViewLoading = () => {
  return (
    <PageLayout
      title="Carregando..."
      subtitle="Preparando o conteúdo da aula"
      background="dark"
    >
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-white">Carregando...</div>
      </div>
    </PageLayout>
  );
};
