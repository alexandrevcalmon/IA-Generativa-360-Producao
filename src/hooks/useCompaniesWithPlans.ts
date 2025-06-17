
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyWithPlan {
  id: string;
  name: string;
  official_name: string | null;
  logo_url: string | null;
  max_students: number;
  current_students: number;
  is_active: boolean;
  created_at: string;
  contact_email: string | null;
  subscription_plan: {
    id: string;
    name: string;
    price: number;
    annual_price: number;
    semester_price: number;
    max_students: number;
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
          official_name,
          logo_url,
          max_students,
          current_students,
          is_active,
          created_at,
          contact_email,
          subscription_plan:subscription_plan_id (
            id,
            name,
            price,
            annual_price,
            semester_price,
            max_students
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
