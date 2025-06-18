
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
