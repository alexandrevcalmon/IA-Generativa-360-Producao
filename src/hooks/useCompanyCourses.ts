
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyCourse {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  category?: string;
  difficulty_level: string;
  estimated_hours?: number;
  is_published: boolean;
  enrolled_students: number;
  completed_students: number;
  created_at: string;
}

export const useCompanyCourses = () => {
  return useQuery({
    queryKey: ['company-courses'],
    queryFn: async () => {
      console.log('Fetching published courses...');

      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments_aggregate:enrollments(count),
          completed_enrollments:enrollments!inner(completed_at)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      console.log('Published courses fetched:', courses);

      return (courses || []).map(course => ({
        ...course,
        enrolled_students: course.enrollments_aggregate?.[0]?.count || 0,
        completed_students: course.completed_enrollments?.filter((e: any) => e.completed_at).length || 0
      })) as CompanyCourse[];
    },
  });
};
