// Stub file for useSubscriptionPlans hook
// TODO: Implement when subscription_plans table exists

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  semester_price?: number;
  annual_price?: number;
  max_students?: number;
  is_active?: boolean;
}

export interface CreatePlanData {
  name: string;
  description: string;
  price: number;
  features: string[];
  semester_price?: number;
  annual_price?: number;
  max_students?: number;
}

export const useSubscriptionPlans = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreateSubscriptionPlan = () => {
  return {
    mutate: (data?: any) => {},
    mutateAsync: async (data?: any) => {},
    isLoading: false,
    isPending: false
  };
};

export const useUpdateSubscriptionPlan = () => {
  return {
    mutate: (data?: any) => {},
    mutateAsync: async (data?: any) => {},
    isLoading: false,
    isPending: false
  };
};