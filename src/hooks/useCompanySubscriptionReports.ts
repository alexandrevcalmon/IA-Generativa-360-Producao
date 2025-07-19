import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth';

interface CompanySubscriptionReport {
  id: string;
  name: string;
  contact_email: string;
  contact_name: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  max_collaborators: number;
  total_collaborators: number;
  active_collaborators: number;
  blocked_collaborators: number;
  days_until_expiry: number | null;
  is_overdue: boolean;
  last_payment_date: string | null;
  created_at: string;
  subscription_plan_data?: {
    name: string;
    price: number;
  };
  // Novos campos do Stripe
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_data?: {
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    plan_name: string;
    amount: number;
    currency: string;
  };
}

interface SubscriptionReportsData {
  companies: CompanySubscriptionReport[];
  summary: {
    totalCompanies: number;
    activeSubscriptions: number;
    overdueSubscriptions: number;
    canceledSubscriptions: number;
    totalRevenue: number;
    totalBlockedCollaborators: number;
    companiesAtRisk: number;
    // Novos campos do Stripe
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    churnRate: number;
  };
  overdueCompanies: CompanySubscriptionReport[];
  atRiskCompanies: CompanySubscriptionReport[];
}

export function useCompanySubscriptionReports() {
  const { user, userRole } = useAuth();

  return useQuery<SubscriptionReportsData>({
    queryKey: ['company-subscription-reports', user?.id],
    queryFn: async () => {
      if (!user?.id || userRole !== 'producer') {
        throw new Error('Apenas produtores podem acessar relatórios de assinaturas');
      }

      // Buscar todas as empresas com dados de assinatura
      const { data: companies, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          contact_email,
          contact_name,
          subscription_status,
          subscription_ends_at,
          max_collaborators,
          created_at,
          stripe_customer_id,
          stripe_subscription_id,
          subscription_plan_id,
          subscription_plan_data:subscription_plans!companies_subscription_plan_id_fkey (
            id,
            name,
            price,
            annual_price,
            semester_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Erro ao buscar dados das empresas');
      }

      // Buscar dados de colaboradores e verificar status no Stripe para cada empresa
      const companiesWithCollaborators = await Promise.all(
        companies?.map(async (company) => {
          // Buscar colaboradores
          const { data: collaborators, error: collabError } = await supabase
            .from('company_users')
            .select('id, is_active')
            .eq('company_id', company.id);

          if (collabError) {
            console.error(`Erro ao buscar colaboradores da empresa ${company.name}:`, collabError);
          }

          const totalCollaborators = collaborators?.length || 0;
          const activeCollaborators = collaborators?.filter(c => c.is_active).length || 0;
          const blockedCollaborators = totalCollaborators - activeCollaborators;

          // Verificar status no Stripe se tiver subscription_id
          let stripeData = null;
          if (company.stripe_subscription_id) {
            try {
              const { data: stripeResult, error: stripeError } = await supabase.functions.invoke('check-subscription', {
                body: {
                  userId: company.id // Usar o ID da empresa como userId
                }
              });

              if (!stripeError && stripeResult?.success) {
                stripeData = stripeResult.subscription;
              }
            } catch (stripeError) {
              console.warn(`Erro ao verificar assinatura no Stripe para ${company.name}:`, stripeError);
            }
          }

          // Calcular dias até expiração (usar dados do Stripe se disponível)
          let daysUntilExpiry = null;
          let isOverdue = false;
          
          const expirationDate = stripeData?.current_period_end 
            ? new Date(stripeData.current_period_end * 1000)
            : company.subscription_ends_at 
            ? new Date(company.subscription_ends_at)
            : null;

          if (expirationDate) {
            const today = new Date();
            const diffTime = expirationDate.getTime() - today.getTime();
            daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            isOverdue = daysUntilExpiry < 0;
          }

          // Determinar status final (priorizar Stripe)
          const finalStatus = stripeData?.status || company.subscription_status;

          return {
            ...company,
            subscription_status: finalStatus,
            subscription_ends_at: expirationDate?.toISOString() || company.subscription_ends_at,
            total_collaborators: totalCollaborators,
            active_collaborators: activeCollaborators,
            blocked_collaborators: blockedCollaborators,
            days_until_expiry: daysUntilExpiry,
            is_overdue: isOverdue,
            last_payment_date: expirationDate?.toISOString() || company.subscription_ends_at,
            stripe_data: stripeData ? {
              status: stripeData.status,
              current_period_end: new Date(stripeData.current_period_end * 1000).toISOString(),
              cancel_at_period_end: stripeData.cancel_at_period_end,
              plan_name: stripeData.items?.data?.[0]?.price?.product?.name || 'Plano Personalizado',
              amount: stripeData.items?.data?.[0]?.price?.unit_amount || 0,
              currency: stripeData.currency || 'brl'
            } : undefined
          };
        }) || []
      );

      // Calcular resumo com dados do Stripe
      const activeSubscriptions = companiesWithCollaborators.filter(c => 
        c.subscription_status === 'active' || c.subscription_status === 'trialing'
      );
      
      const overdueSubscriptions = companiesWithCollaborators.filter(c => 
        c.subscription_status === 'past_due' || c.is_overdue
      );
      
      const canceledSubscriptions = companiesWithCollaborators.filter(c => 
        c.subscription_status === 'canceled'
      );

      // Calcular receita recorrente com valores corretos
      const monthlyRecurringRevenue = companiesWithCollaborators
        .filter(c => c.subscription_status === 'active' || c.subscription_status === 'trialing')
        .reduce((sum, c) => {
          let amount = 0;
          
          // Priorizar dados do Stripe (que vêm em centavos)
          if (c.stripe_data?.amount) {
            amount = c.stripe_data.amount / 100; // Converter centavos para reais
          } 
          // Fallback para dados locais (que já estão em reais)
          else if (c.subscription_plan_data?.price) {
            amount = c.subscription_plan_data.price;
          }
          
          return sum + amount;
        }, 0);

      const annualRecurringRevenue = monthlyRecurringRevenue * 12;

      // Calcular taxa de churn (simplificado)
      const totalSubscriptions = companiesWithCollaborators.length;
      const churnRate = totalSubscriptions > 0 
        ? (canceledSubscriptions.length / totalSubscriptions) * 100 
        : 0;

      // Calcular receita total (usar mesma lógica do MRR)
      const totalRevenue = companiesWithCollaborators.reduce((sum, c) => {
        let amount = 0;
        
        if (c.stripe_data?.amount) {
          amount = c.stripe_data.amount / 100;
        } else if (c.subscription_plan_data?.price) {
          amount = c.subscription_plan_data.price;
        }
        
        return sum + amount;
      }, 0);

      const summary = {
        totalCompanies: companiesWithCollaborators.length,
        activeSubscriptions: activeSubscriptions.length,
        overdueSubscriptions: overdueSubscriptions.length,
        canceledSubscriptions: canceledSubscriptions.length,
        totalRevenue,
        totalBlockedCollaborators: companiesWithCollaborators.reduce((sum, c) => sum + c.blocked_collaborators, 0),
        companiesAtRisk: companiesWithCollaborators.filter(c => 
          c.days_until_expiry !== null && c.days_until_expiry <= 7 && c.days_until_expiry > 0
        ).length,
        monthlyRecurringRevenue,
        annualRecurringRevenue,
        churnRate
      };

      // Filtrar empresas em situação crítica
      const overdueCompanies = companiesWithCollaborators.filter(c => 
        c.subscription_status === 'past_due' || c.is_overdue
      );

      const atRiskCompanies = companiesWithCollaborators.filter(c => 
        c.days_until_expiry !== null && c.days_until_expiry <= 7 && c.days_until_expiry > 0
      );

      return {
        companies: companiesWithCollaborators,
        summary,
        overdueCompanies,
        atRiskCompanies
      };
    },
    enabled: !!user?.id && userRole === 'producer',
    staleTime: 2 * 60 * 1000, // 2 minutos (mais frequente para dados do Stripe)
  });
} 