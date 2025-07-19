import { PageLayout } from "@/components/PageLayout";
import { PageSection } from "@/components/PageSection";
import { StatsGrid, type StatItem } from "@/components/StatsGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Crown,
  Star,
  Users,
  Check,
  Zap,
  Building2,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { CreatePlanDialog } from "@/components/CreatePlanDialog";
import { EditPlanDialog } from "@/components/EditPlanDialog";
import { useStripePrices } from "@/hooks/useStripePrices";
import { useCompaniesWithPlans } from "@/hooks/useCompaniesWithPlans";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StripePlan {
  id: string;
  name: string;
  max_collaborators: number;
  subscription_period_days: number;
  stripe_product_id: string;
  stripe_price_id: string;
  price?: number;
  currency?: string;
  features?: any[];
  created_at: string;
  updated_at: string;
  // Campos adicionais que podem estar presentes
  description?: string | null;
  max_students?: number;
  semester_price?: number;
  annual_price?: number;
  is_active?: boolean;
}

const ProducerPlans = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<StripePlan | null>(null);

  const { plans, loading: plansLoading, error: plansError } = useStripePrices();
  const { data: companies = [], isLoading: companiesLoading } = useCompaniesWithPlans();

  const handleRefresh = () => {
    window.location.reload();
  };

  const getColorClasses = (index: number, variant: 'bg' | 'border' | 'text') => {
    const colors = ['gray', 'blue', 'purple'];
    const color = colors[index % colors.length];
    
    const colorMap = {
      gray: {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-600"
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200", 
        text: "text-blue-600"
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600"
      }
    };
    return colorMap[color as keyof typeof colorMap]?.[variant] || colorMap.gray[variant];
  };

  const getPlanIcon = (maxCollaborators: number) => {
    if (maxCollaborators <= 5) return Zap;
    if (maxCollaborators <= 25) return Star;
    return Crown;
  };

  const totalCompanies = companies.length;
  const totalRevenue = companies.reduce((sum, company) => {
    // Encontrar o plano correspondente
    const plan = plans.find(p => p.stripe_price_id === company.subscription_plan_id);
    
    if (plan && plan.price) {
      // Calcular receita baseada no período de cobrança
      if (company.billing_period === 'annual') {
        return sum + (Number(plan.price) / 12); // Receita mensal
      } else {
        return sum + (Number(plan.price) / 6); // Receita mensal
      }
    }
    return sum;
  }, 0);
  
  const planStats = plans.map(plan => ({
    ...plan,
    companies_count: companies.filter(company => company.subscription_plan_id === plan.stripe_price_id).length
  }));

  const mostPopularPlan = planStats.reduce((max, plan) => 
    plan.companies_count > (max?.companies_count || 0) ? plan : max, planStats[0]);

  // Stats para o StatsGrid
  const statsItems: StatItem[] = [
    {
      title: "Total de Empresas",
      value: totalCompanies,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Receita Mensal",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Plano Mais Popular",
      value: mostPopularPlan?.name || "N/A",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Planos Ativos",
      value: plans.length,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    }
  ];

  const handleEditPlan = (plan: StripePlan) => {
    setSelectedPlan(plan);
    setEditDialogOpen(true);
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("Tem certeza que deseja desativar este plano? Empresas com este plano não serão afetadas.")) {
      // Implementar lógica de desativação do plano no Stripe
      console.log('Desativando plano:', planId);
    }
  };

  // Header content com botão de criar plano
  const headerContent = (
    <div className="flex space-x-2">
      <Button 
        onClick={handleRefresh}
        variant="outline"
        className="flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Atualizar
      </Button>
      <Button 
        onClick={() => setCreateDialogOpen(true)}
        className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Novo Plano
      </Button>
    </div>
  );

  if (plansLoading || companiesLoading) {
    return (
      <PageLayout
        title="Gerenciar Planos"
        subtitle="Carregando dados..."
      >
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  // Verificar se há planos
  if (!plansLoading && plans.length === 0) {
    return (
      <PageLayout
        title="Gerenciar Planos"
        subtitle="Nenhum plano encontrado"
        headerContent={headerContent}
      >
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano cadastrado</h3>
            <p className="text-gray-600">
              Não foram encontrados planos de assinatura cadastrados no Stripe.
            </p>
            {plansError && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-800 font-medium">Erro ao carregar planos:</p>
                <p className="text-red-700 text-sm">{plansError}</p>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Plano
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gerenciar Planos"
      subtitle="Gerencie os planos de assinatura das empresas clientes"
      headerContent={headerContent}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <StatsGrid stats={statsItems} />

        {/* Plans Grid */}
        <PageSection transparent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {planStats.map((plan, index) => {
              const IconComponent = getPlanIcon(plan.max_collaborators);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative hover-lift ${
                    plan.companies_count === mostPopularPlan?.companies_count && plan.companies_count > 0 
                      ? 'ring-2 ring-calmon-500 ring-opacity-50' : ''
                  }`}
                >
                  {plan.companies_count === mostPopularPlan?.companies_count && plan.companies_count > 0 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-calmon-500 to-calmon-700 text-white px-4 py-1">
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${getColorClasses(index, 'bg')} flex items-center justify-center`}>
                      <IconComponent className={`h-8 w-8 ${getColorClasses(index, 'text')}`} />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-gray-600 mt-2">
                        {plan.subscription_period_days === 180 ? 'Plano Semestral' : 'Plano Anual'}
                      </p>
                    </div>
                    
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">
                        {plan.price ? `R$ ${Number(plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'}
                      </span>
                      <span className="text-gray-600 ml-1">
                        /{plan.subscription_period_days === 180 ? 'semestre' : 'ano'}
                      </span>
                    </div>
                    <p className="text-md text-gray-500 mt-1">
                      {plan.subscription_period_days === 180 ? '6 meses' : '12 meses'}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Até {plan.max_collaborators} colaboradores</span>
                      </div>
                      {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">
                            {typeof feature === 'string' ? feature : feature.title || 'Recurso'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={`p-4 rounded-lg ${getColorClasses(index, 'bg')} ${getColorClasses(index, 'border')} border`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Empresas no plano</p>
                          <p className="text-2xl font-bold">{plan.companies_count}</p>
                        </div>
                        <Users className={`h-8 w-8 ${getColorClasses(index, 'text')}`} />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </PageSection>

        {/* Plan Comparison */}
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-calmon-600" />
                Comparativo de Planos
              </CardTitle>
              <CardDescription>
                Visão detalhada das diferenças entre os planos disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plano</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Colaboradores</TableHead>
                      <TableHead>Empresas</TableHead>
                      <TableHead>ID Stripe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planStats.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          {plan.subscription_period_days === 180 ? 'Semestral' : 'Anual'}
                        </TableCell>
                        <TableCell>
                          {plan.price ? `R$ ${Number(plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'}
                        </TableCell>
                        <TableCell>{plan.max_collaborators}</TableCell>
                        <TableCell>{plan.companies_count}</TableCell>
                        <TableCell className="text-xs font-mono">
                          {plan.stripe_price_id}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </div>

      <CreatePlanDialog 
        isOpen={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)} 
      />
      
      <EditPlanDialog 
        isOpen={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        plan={selectedPlan}
      />
    </PageLayout>
  );
};

export default ProducerPlans;