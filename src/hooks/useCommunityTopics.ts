// Stub file for useCommunityTopics hook
// TODO: Implement when community_topics table exists

export const useCommunityTopics = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreateCommunityTopic = () => {
  return {
    mutate: () => {},
    isLoading: false
  };
};