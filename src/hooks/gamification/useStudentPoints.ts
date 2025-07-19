// Stub file for useStudentPoints hook
// TODO: Implement when points_history table exists

export interface StudentPoints {
  total_points: number;
  level: number;
  streak_days: number;
}

export interface StudentAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
}

export const useStudentPoints = () => {
  return {
    addPointsForAction: () => Promise.resolve(),
    isLoading: false,
    error: null
  };
};

export const useStudentAchievements = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const usePointsHistory = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const awardPointsToStudent = (params: any) => Promise.resolve();

export const POINTS_CONFIG = {
  community_topic_liked: 5,
  community_reply_liked: 3,
  community_reply_created: 10,
  community_topic_created: 15,
};

export const GAMIFICATION_RULES = {
  community_topic_liked: 5,
  community_reply_liked: 3,
  community_reply_created: 10,
  community_topic_created: 15,
};

export const DAILY_LIMITS = {
  community_topic_created: 5,
};