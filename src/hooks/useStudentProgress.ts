
// Re-export all progress-related hooks for backward compatibility
export { 
  useUpdateLessonProgress, 
  useMarkLessonComplete, 
  useEnrollInCourse, 
  useDebouncedLessonProgress 
} from './progress';
export type { UpdateProgressParams, ProgressUpdateResult } from './progress';
