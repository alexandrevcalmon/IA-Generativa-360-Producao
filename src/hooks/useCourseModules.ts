
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  image_url: string | null;
  created_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  video_file_url: string | null;
  material_url: string | null;
  image_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_free: boolean;
  resources: any;
}

export const useCourseModules = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      console.log('[useCourseModules] Fetching modules for course:', courseId);
      
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select(`
          *,
          lessons(*)
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesError) {
        console.error('[useCourseModules] Error fetching modules:', modulesError);
        throw modulesError;
      }
      
      console.log('[useCourseModules] Modules fetched successfully:', modules);
      return (modules as CourseModule[]) || [];
    },
    enabled: !!courseId && !!user,
  });
};
