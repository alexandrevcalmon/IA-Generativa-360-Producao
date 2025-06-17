
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty_level: string | null;
  estimated_hours: number | null;
  thumbnail_url: string | null;
  is_published: boolean | null;
  tags: string[] | null;
  instructor_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching courses for user:', user?.id);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
      
      console.log('Courses fetched successfully:', data?.length);
      return data as Course[];
    },
    enabled: !!user,
  });
};

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

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...courseData }: Partial<Course> & { id: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Updating course:', id);
      console.log('Update data:', courseData);
      console.log('Current user:', user.id);

      const { data, error } = await supabase
        .from('courses')
        .update({ ...courseData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating course:', error);
        throw error;
      }
      
      console.log('Course updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Sucesso",
        description: "Curso atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar curso: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Deleting course:', courseId);
      console.log('Current user:', user.id);

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        console.error('Error deleting course:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Sucesso",
        description: "Curso excluído com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir curso: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCourse = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      console.log('Fetching single course:', courseId);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
      
      console.log('Course fetched successfully:', data);
      return data as Course;
    },
    enabled: !!courseId && !!user,
  });
};
