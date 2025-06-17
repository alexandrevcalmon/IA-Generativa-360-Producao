
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Course } from '@/hooks/useCoursesQuery';

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Creating course with data:', courseData);
      console.log('Current user:', user.id);

      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) {
        console.error('Error creating course:', error);
        throw error;
      }
      
      console.log('Course created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Sucesso",
        description: "Curso criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar curso: " + error.message,
        variant: "destructive",
      });
    },
  });
};
