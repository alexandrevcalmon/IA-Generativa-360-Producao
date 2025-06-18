
import { useCallback } from 'react';
import { useUpdateLessonProgress } from './useUpdateLessonProgress';
import { debounce } from './utils';
import { UpdateProgressParams } from './types';

// Hook for debounced progress updates with improved timing
export const useDebouncedLessonProgress = () => {
  const updateProgress = useUpdateLessonProgress();
  
  const debouncedUpdate = useCallback(
    debounce((params: UpdateProgressParams) => {
      updateProgress.mutate(params);
    }, 3000), // Increased to 3 seconds to reduce conflicts
    [updateProgress]
  );

  return {
    ...updateProgress,
    debouncedMutate: debouncedUpdate
  };
};
