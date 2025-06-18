
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { useCompanyData } from "./useCompanyData";

export interface CompanyMentorship {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  max_participants: number;
  participants_count: number;
  status: string;
  meet_url?: string;
  created_at: string;
}

export const useCompanyMentorships = () => {
  const { user, userRole } = useAuth();
  const { data: companyData } = useCompanyData();

  return useQuery({
    queryKey: ['company-mentorships', user?.id, companyData?.id],
    queryFn: async () => {
      if (!user?.id || !companyData?.id) {
        throw new Error('User not authenticated or company not found');
      }

      console.log('🎯 Fetching mentorships for company:', companyData.id);

      const { data: mentorships, error } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .eq('company_id', companyData.id)
        .order('scheduled_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching mentorships:', error);
        throw error;
      }

      console.log('✅ Found mentorships:', mentorships?.length || 0);

      // For each mentorship, get participant count
      const mentorshipsWithCounts = await Promise.all(
        (mentorships || []).map(async (mentorship) => {
          try {
            const { count } = await supabase
              .from('mentorship_attendees')
              .select('*', { count: 'exact', head: true })
              .eq('mentorship_session_id', mentorship.id);

            return {
              ...mentorship,
              participants_count: count || 0
            };
          } catch (error) {
            console.warn('⚠️ Error fetching participants for mentorship:', mentorship.id, error);
            return {
              ...mentorship,
              participants_count: 0
            };
          }
        })
      );

      return mentorshipsWithCounts as CompanyMentorship[];
    },
    enabled: !!user?.id && !!companyData?.id && userRole === 'company',
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
