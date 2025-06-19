
// Re-export all progress-related hooks for backward compatibility
export { 
  useUpdateLessonProgress, 
  useMarkLessonComplete, 
  useEnrollInCourse, 
  useDebouncedLessonProgress 
} from './progress';

// Add the missing useStudentProgress alias
export { useUpdateLessonProgress as useStudentProgress } from './progress';
export { useMarkLessonComplete as markLessonCompleted } from './progress';

export type { UpdateProgressParams, ProgressUpdateResult } from './progress';
