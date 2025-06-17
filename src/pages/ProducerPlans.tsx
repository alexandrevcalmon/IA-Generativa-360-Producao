
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  TrendingUp
} from "lucide-react";

const ProducerPlans = () => {
  const plans = [
    {
      id: "basic",
      name: "Básico",
      description: "Para pequenas empresas que estão começando",
      price: "R$ 99",
      period: "/mês",
      max_students: 50,
      icon: Building2,
      color: "gray",
      features: [
        "Até 50 colaboradores",
        "Acesso a todos os cursos",
        "Relatórios básicos",
        "Suporte por email",
        "Certificados digitais"
      ],
      companies_count: 8
    },
    {
      id: "business",
      name: "Business",
      description: "Para empresas em crescimento",
      price: "R$ 199",
      period: "/mês",
      max_students: 150,
      icon: Star,
      color: "blue",
      popular: true,
      features: [
        "Até 150 colaboradores",
        "Acesso a todos os cursos",
        "Relatórios avançados",
        "Suporte prioritário",
        "Certificados personalizados",
        "Analytics detalhados",
        "API de integração"
      ],
      companies_count: 15
    },
    {
      id: "premium",
      name: "Premium",
      description: "Para grandes empresas com necessidades avançadas",
      price: "R$ 399",
      period: "/mês",
      max_students: 200,
      icon: Crown,
      color: "purple",
      features: [
        "Até 200 colaboradores",
        "Acesso a todos os cursos",
        "Relatórios personalizados",
        "Suporte 24/7",
        "Certificados com marca própria",
        "Analytics em tempo real",
        "API completa",
        "Gerente de sucesso dedicado",
        "Cursos personalizados"
      ],
      companies_count: 5
    }
  ];

  const getColorClasses = (color: string, variant: 'bg' | 'border' | 'text') => {
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

  const stats = [
    {
      title: "Total de Empresas",
      value: plans.reduce((sum, plan) => sum + plan.companies_count, 0),
      icon: Building2,
      color: "blue"
    },
    {
      title: "Receita Mensal",
      value: "R$ 12.450",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Plano Mais Popular",
      value: "Business",
      icon: Star,
      color: "blue"
    },
    {
      title: "Taxa de Conversão",
      value: "87%",
      icon: Zap,
      color: "purple"
    }
  ];

  return (
    <>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gerenciar Planos</h1>
                  <p className="text-gray-600">Gerencie os planos de assinatura das empresas clientes</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative hover-lift ${
                      plan.popular ? 'ring-2 ring-calmon-500 ring-opacity-50' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-calmon-500 to-calmon-700 text-white px-4 py-1">
                          Mais Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-full ${getColorClasses(plan.color, 'bg')} flex items-center justify-center`}>
                        <plan.icon className={`h-8 w-8 ${getColorClasses(plan.color, 'text')}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <p className="text-gray-600 mt-2">{plan.description}</p>
                      </div>
                      
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-600 ml-1">{plan.period}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`p-4 rounded-lg ${getColorClasses(plan.color, 'bg')} ${getColorClasses(plan.color, 'border')} border`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Empresas no plano</p>
                            <p className="text-2xl font-bold">{plan.companies_count}</p>
                          </div>
                          <Users className={`h-8 w-8 ${getColorClasses(plan.color, 'text')}`} />
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-calmon-500 to-calmon-700 hover:from-calmon-600 hover:to-calmon-800 text-white"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Ver Empresas do Plano
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Plan Comparison */}
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
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Recursos</th>
                          <th className="text-center py-3 px-4">Básico</th>
                          <th className="text-center py-3 px-4">Business</th>
                          <th className="text-center py-3 px-4">Premium</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Colaboradores</td>
                          <td className="text-center py-3 px-4">50</td>
                          <td className="text-center py-3 px-4">150</td>
                          <td className="text-center py-3 px-4">200</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Relatórios</td>
                          <td className="text-center py-3 px-4">Básicos</td>
                          <td className="text-center py-3 px-4">Avançados</td>
                          <td className="text-center py-3 px-4">Personalizados</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Suporte</td>
                          <td className="text-center py-3 px-4">Email</td>
                          <td className="text-center py-3 px-4">Prioritário</td>
                          <td className="text-center py-3 px-4">24/7</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">API</td>
                          <td className="text-center py-3 px-4">❌</td>
                          <td className="text-center py-3 px-4">✅</td>
                          <td className="text-center py-3 px-4">✅ Completa</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProducerPlans;
