
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

      // For each course, get modules/lessons and progress
      const coursesWithProgress = await Promise.all(
        (courses || []).map(async (course) => {
          console.log('Processing course:', course.title);

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

              // Get progress for each lesson
              const lessonsWithProgress = await Promise.all(
                (lessons || []).map(async (lesson) => {
                  const { data: lessonProgress, error: progressError } = await supabase
                    .from('lesson_progress')
                    .select('completed, watch_time_seconds')
                    .eq('lesson_id', lesson.id)
                    .eq('user_id', user.id)
                    .maybeSingle();

                  if (progressError) {
                    console.error('Error fetching lesson progress:', progressError);
                  }

                  return {
                    ...lesson,
                    completed: lessonProgress?.completed || false,
                    watch_time_seconds: lessonProgress?.watch_time_seconds || 0,
                  };
                })
              );

              return {
                ...module,
                lessons: lessonsWithProgress,
              };
            })
          );

          // Calculate progress percentage based on completed lessons
          const totalLessons = modulesWithLessons.reduce((total, module) => total + module.lessons.length, 0);
          const completedLessons = modulesWithLessons.reduce((total, module) => 
            total + module.lessons.filter(lesson => lesson.completed).length, 0
          );
          const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          return {
            ...course,
            progress_percentage: progressPercentage,
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
              const { data: lessonProgress } = await supabase
                .from('lesson_progress')
                .select('completed, watch_time_seconds')
                .eq('lesson_id', lesson.id)
                .eq('user_id', user.id)
                .maybeSingle();

              return {
                ...lesson,
                completed: lessonProgress?.completed || false,
                watch_time_seconds: lessonProgress?.watch_time_seconds || 0,
              };
            })
          );

          return {
            ...module,
            lessons: lessonsWithProgress,
          };
        })
      );

      // Calculate progress percentage
      const totalLessons = modulesWithLessons.reduce((total, module) => total + module.lessons.length, 0);
      const completedLessons = modulesWithLessons.reduce((total, module) => 
        total + module.lessons.filter(lesson => lesson.completed).length, 0
      );
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        ...course,
        progress_percentage: progressPercentage,
        modules: modulesWithLessons,
      } as StudentCourse;
    },
    enabled: !!user && !!courseId,
  });
};
