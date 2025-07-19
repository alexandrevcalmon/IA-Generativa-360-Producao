// Stub file for useStudentCourses hook
// TODO: Implement when courses table exists

export interface StudentCourse {
  id: string;
  title: string;
  description?: string;
  modules: any[];
  thumbnail_url?: string;
  category?: string;
  difficulty_level?: string;
  estimated_hours?: number;
}

export interface StudentLesson {
  id: string;
  title: string;
  content?: string;
  video_url?: string;
  video_file_url?: string;
  material_url?: string;
  completed?: boolean;
  watch_time_seconds?: number;
}

export const useStudentCourses = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useStudentCourseProgress = () => {
  return {
    data: null,
    isLoading: false,
    error: null
  };
};

export const useStudentLessonProgress = () => {
  return {
    data: null,
    isLoading: false,
    error: null
  };
};

export const useStudentCourse = () => {
  return {
    data: null,
    isLoading: false,
    error: null
  };
};