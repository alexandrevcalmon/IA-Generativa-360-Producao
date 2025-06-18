
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export interface CompanyMentorship {
  id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  max_participants: number;
  meet_url?: string;
  participants_count: number;
  created_at: string;
}

export const useCompanyMentorships = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['company-mentorships', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Buscar o company_id primeiro
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (companyError || !companyData) {
        console.error('Error fetching company:', companyError);
        return [];
      }

      // Buscar as sessões de mentoria da empresa
      const { data: sessions, error: sessionsError } = await supabase
        .from('mentorship_sessions')
        .select(`
          *,
          participants_count:mentorship_attendees(count)
        `)
        .eq('company_id', companyData.id)
        .order('scheduled_at', { ascending: true });

      if (sessionsError) {
        console.error('Error fetching mentorship sessions:', sessionsError);
        throw sessionsError;
      }

      return (sessions || []).map(session => ({
        ...session,
        participants_count: session.participants_count?.[0]?.count || 0
      })) as CompanyMentorship[];
    },
    enabled: !!user?.id,
  });
};
