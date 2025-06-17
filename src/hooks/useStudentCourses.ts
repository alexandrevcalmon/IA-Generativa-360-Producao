
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface StudentCourse {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  difficulty_level: string;
  estimated_hours: number;
  progress_percentage: number;
  enrolled_at: string;
  modules: StudentModule[];
}

export interface StudentModule {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: StudentLesson[];
}

export interface StudentLesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  video_file_url: string;
  material_url: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  completed: boolean;
  watch_time_seconds: number;
}

export const useStudentCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-courses', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching courses for student:', user.id);

      // Get courses that are published - this will now work with RLS policies
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        throw coursesError;
      }

      console.log('Found published courses:', courses?.length || 0);

      // For each course, get enrollment info and modules/lessons
      const coursesWithProgress = await Promise.all(
        (courses || []).map(async (course) => {
          console.log('Processing course:', course.title);

          // Get enrollment info
          const { data: enrollment, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('progress_percentage, enrolled_at')
            .eq('course_id', course.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (enrollmentError) {
            console.error('Error fetching enrollment for course', course.id, ':', enrollmentError);
          }

          // Get modules - this will now work with RLS policies
          const { data: modules, error: modulesError } = await supabase
            .from('course_modules')
            .select('*')
            .eq('course_id', course.id)
            .eq('is_published', true)
            .order('order_index');

          if (modulesError) {
            console.error('Error fetching modules for course', course.id, ':', modulesError);
          }

          const modulesWithLessons = await Promise.all(
            (modules || []).map(async (module) => {
              console.log('Processing module:', module.title);

              // Get lessons - this will now work with RLS policies
              const { data: lessons, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .eq('module_id', module.id)
                .order('order_index');

              if (lessonsError) {
                console.error('Error fetching lessons for module', module.id, ':', lessonsError);
              }

              // Get progress for each lesson if user is enrolled
              const lessonsWithProgress = await Promise.all(
                (lessons || []).map(async (lesson) => {
                  let progress = null;
                  
                  if (enrollment) {
                    const { data: lessonProgress, error: progressError } = await supabase
                      .from('lesson_progress')
                      .select('completed, watch_time_seconds')
                      .eq('lesson_id', lesson.id)
                      .eq('user_id', user.id)
                      .maybeSingle();

                    if (progressError) {
                      console.error('Error fetching lesson progress:', progressError);
                    } else {
                      progress = lessonProgress;
                    }
                  }

                  return {
                    ...lesson,
                    completed: progress?.completed || false,
                    watch_time_seconds: progress?.watch_time_seconds || 0,
                  };
                })
              );

              return {
                ...module,
                lessons: lessonsWithProgress,
              };
            })
          );

          return {
            ...course,
            progress_percentage: enrollment?.progress_percentage || 0,
            enrolled_at: enrollment?.enrolled_at || null,
            modules: modulesWithLessons,
          };
        })
      );

      console.log('Processed courses with modules and lessons:', coursesWithProgress.length);
      return coursesWithProgress as StudentCourse[];
    },
    enabled: !!user,
  });
};

export const useStudentCourse = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-course', courseId, user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching course details for:', courseId);

      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        throw error;
      }

      // Get enrollment info
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('progress_percentage, enrolled_at')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .maybeSingle();

      // Get modules with lessons
      const { data: modules } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('order_index');

      const modulesWithLessons = await Promise.all(
        (modules || []).map(async (module) => {
          const { data: lessons } = await supabase
            .from('lessons')
            .select('*')
            .eq('module_id', module.id)
            .order('order_index');

          const lessonsWithProgress = await Promise.all(
            (lessons || []).map(async (lesson) => {
              let progress = null;
              
              if (enrollment) {
                const { data: lessonProgress } = await supabase
                  .from('lesson_progress')
                  .select('completed, watch_time_seconds')
                  .eq('lesson_id', lesson.id)
                  .eq('user_id', user.id)
                  .maybeSingle();

                progress = lessonProgress;
              }

              return {
                ...lesson,
                completed: progress?.completed || false,
                watch_time_seconds: progress?.watch_time_seconds || 0,
              };
            })
          );

          return {
            ...module,
            lessons: lessonsWithProgress,
          };
        })
      );

      return {
        ...course,
        progress_percentage: enrollment?.progress_percentage || 0,
        enrolled_at: enrollment?.enrolled_at || null,
        modules: modulesWithLessons,
      } as StudentCourse;
    },
    enabled: !!user && !!courseId,
  });
};
