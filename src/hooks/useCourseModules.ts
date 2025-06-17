
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export const useCourseModules = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      console.log('Fetching modules for course:', courseId);
      
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }
      
      console.log('Modules fetched successfully:', data?.length);
      return data as CourseModule[];
    },
    enabled: !!courseId && !!user,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (moduleData: Omit<CourseModule, 'id' | 'created_at'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Creating module with data:', moduleData);

      const { data, error } = await supabase
        .from('course_modules')
        .insert([moduleData])
        .select()
        .single();

      if (error) {
        console.error('Error creating module:', error);
        throw error;
      }
      
      console.log('Module created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-modules', data.course_id] });
      toast({
        title: "Sucesso",
        description: "Módulo criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Create module error:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar módulo: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...moduleData }: Partial<CourseModule> & { id: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Updating module:', id);

      const { data, error } = await supabase
        .from('course_modules')
        .update(moduleData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating module:', error);
        throw error;
      }
      
      console.log('Module updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-modules', data.course_id] });
      toast({
        title: "Sucesso",
        description: "Módulo atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Update module error:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar módulo: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ moduleId, courseId }: { moduleId: string; courseId: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Deleting module:', moduleId);

      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);

      if (error) {
        console.error('Error deleting module:', error);
        throw error;
      }

      return { moduleId, courseId };
    },
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course-modules', courseId] });
      toast({
        title: "Sucesso",
        description: "Módulo excluído com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Delete module error:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir módulo: " + error.message,
        variant: "destructive",
      });
    },
  });
};
