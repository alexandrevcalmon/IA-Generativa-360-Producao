
// Main export file for progress-related hooks
export const useUpdateLessonProgress = () => {
  return {
    mutate: (data?: any) => {},
    isLoading: false
  };
};

export const useMarkLessonComplete = () => {
  return {
    mutate: (data?: any) => {},
    isLoading: false
  };
};

export { useEnrollInCourse } from './useEnrollInCourse';

export const useDebouncedLessonProgress = () => {
  return {
    mutate: (data?: any) => {},
    isLoading: false
  };
};
export { useSimplifiedLessonProgress } from './useSimplifiedLessonProgress';
export type { UpdateProgressParams, ProgressUpdateResult } from './types';
