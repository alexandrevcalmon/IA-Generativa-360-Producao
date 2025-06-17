
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyWithPlan {
  id: string;
  name: string;
  logo_url: string | null;
  max_students: number;
  current_students: number;
  is_active: boolean;
  created_at: string;
  subscription_plan: {
    id: string;
    name: string;
    price: number;
  } | null;
}

export const useCompaniesWithPlans = () => {
  return useQuery({
    queryKey: ['companies-with-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          logo_url,
          max_students,
          current_students,
          is_active,
          created_at,
          subscription_plan:subscription_plan_id (
            id,
            name,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies with plans:', error);
        throw error;
      }

      return data as CompanyWithPlan[];
    }
  });
};
