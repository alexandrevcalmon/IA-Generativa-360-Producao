
// Main export file for gamification-related hooks
// export { useStudentPoints } from './useStudentPoints'; // Disabled - table doesn't exist
// export { useStudentAchievements } from './useStudentAchievements'; // Disabled - table doesn't exist
export { useAvailableAchievements } from './useAvailableAchievements';
// export { usePointsHistory } from './usePointsHistory'; // Disabled - table doesn't exist
export type { 
  StudentPoints, 
  StudentAchievement, 
  Achievement, 
  PointsHistoryEntry 
} from './types';
