// Stub file for useToggleTopicLike hook
// TODO: Implement when topic likes functionality is ready

export const useToggleTopicLike = (topicId?: string) => {
  return {
    mutate: (data?: any) => {},
    isLoading: false
  };
};

export const useGetTopicLikes = (topicId?: string) => {
  return {
    data: { isLiked: false, likesCount: 0 },
    isLoading: false,
    error: null
  };
};