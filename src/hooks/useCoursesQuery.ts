import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth'; // useAuth should provide userRole

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
  instructor_id: string | null; // This should match auth.uid() for producers
  created_at: string | null;
  updated_at: string | null;
}

export const useCourses = () => {
  // Get user and userRole from useAuth.
  const { user, userRole } = useAuth();

  return useQuery({
    // Query key is now dynamic based on userRole and user ID to ensure
    // different users/roles get different cached query results.
    queryKey: ['courses', userRole, user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('[useCourses] No user, returning empty array.');
        return [];
      }

      let query = supabase
        .from('courses')
        .select('*');

      if (userRole === 'producer') {
        console.log(`[useCourses] User is a producer. Fetching courses for instructor_id: ${user.id}`);
        query = query.eq('instructor_id', user.id);
      } else {
        // For other roles (e.g., student, collaborator, company), fetch all published courses.
        console.log(`[useCourses] User role is '${userRole}'. Fetching all published courses.`);
        query = query.eq('is_published', true);
      }

      // Common ordering for all queries
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('[useCourses] Error fetching courses:', error.message, error.details);
        throw error; // Rethrow to let React Query handle the error state
      }
      
      console.log(`[useCourses] Courses fetched successfully for role '${userRole}', user '${user.id}'. Count: ${data?.length || 0}`);
      return data as Course[] || []; // Ensure an array is returned even if data is null
    },
    // Query enabled only if user is logged in.
    // The queryFn itself handles the !user case, but this prevents even attempting if no user.
    enabled: !!user,
  });
};

// useCourse hook remains the same for fetching a single course by ID
export const useCourse = (courseId: string) => {
  const { user } = useAuth(); // Keep user check for enabled flag

  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      console.log('[useCourse] Fetching single course:', courseId);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single(); // .single() is okay here, expects one course or error

      if (error) {
        console.error('[useCourse] Error fetching course:', error.message);
        throw error;
      }
      console.log('[useCourse] Course fetched successfully:', data);
      return data as Course;
    },
    enabled: !!courseId && !!user,
  });
};
