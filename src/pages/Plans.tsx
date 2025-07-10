import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Building2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  annual_price: number;
  semester_price: number;
  max_students: number;
  features: any;
  is_active: boolean;
}

const Plans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    navigate(`/company-signup?plan=${planId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('pro')) {
      return <Crown className="h-6 w-6 text-yellow-500" />;
    }
    if (planName.toLowerCase().includes('enterprise') || planName.toLowerCase().includes('corporativo')) {
      return <Building2 className="h-6 w-6 text-purple-500" />;
    }
    return <Users className="h-6 w-6 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selecione o plano que melhor atende às necessidades da sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.name.toLowerCase().includes('premium') || plan.name.toLowerCase().includes('pro')
                  ? 'border-2 border-yellow-400 shadow-xl scale-105' 
                  : 'border hover:border-gray-300'
              }`}
            >
              {(plan.name.toLowerCase().includes('premium') || plan.name.toLowerCase().includes('pro')) && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold">
                  Mais Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(plan.price)}
                    <span className="text-lg font-normal text-gray-500">/mês</span>
                  </div>
                  
                  {plan.semester_price && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ou {formatPrice(plan.semester_price)} por semestre
                    </div>
                  )}
                  
                  {plan.annual_price && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {formatPrice(plan.annual_price)} anual (economize 
                      {Math.round(((plan.price * 12 - plan.annual_price) / (plan.price * 12)) * 100)}%)
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Até {plan.max_students} colaboradores</span>
                </div>

                <div className="space-y-3">
                  {Array.isArray(plan.features) ? plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  )) : (
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Acesso completo à plataforma</span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                    plan.name.toLowerCase().includes('premium') || plan.name.toLowerCase().includes('pro')
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  size="lg"
                >
                  Escolher {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Precisa de mais informações?
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            Voltar ao Início
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.open('mailto:contato@calmonacademy.com', '_blank')}
          >
            Entrar em Contato
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Plans;