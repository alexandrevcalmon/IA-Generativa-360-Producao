// Stub file for useSubscriptionPlans hook
// TODO: Implement when subscription_plans table exists

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export const useSubscriptionPlans = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};