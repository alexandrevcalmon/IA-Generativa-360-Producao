// Stub file for useCommunityReplies hook
// TODO: Implement when community_replies table exists

export const useCommunityReplies = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreateCommunityReply = () => {
  return {
    mutate: () => {},
    isLoading: false
  };
};