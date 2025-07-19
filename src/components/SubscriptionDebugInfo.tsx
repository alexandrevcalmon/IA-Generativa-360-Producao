import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bug, 
  DollarSign, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SubscriptionDebugInfoProps {
  companies: any[];
  summary: any;
}

export function SubscriptionDebugInfo({ companies, summary }: SubscriptionDebugInfoProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Bug className="h-5 w-5" />
          Debug - Valores das Assinaturas
        </CardTitle>
        <CardDescription className="text-orange-700">
          Informações detalhadas para verificar os valores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              R$ {summary.monthlyRecurringRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-orange-600">MRR Calculado</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              R$ {summary.totalRevenue.toFixed(2)}
            </div>
            <div className="text-sm text-orange-600">Receita Total</div>
          </div>
        </div>

        {/* Botão para expandir */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {isExpanded ? 'Ocultar Detalhes' : 'Mostrar Detalhes das Empresas'}
        </Button>

        {/* Detalhes das empresas */}
        {isExpanded && (
          <div className="space-y-3">
            {companies.map((company) => (
              <div key={company.id} className="p-3 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{company.name}</h4>
                  <Badge variant={company.subscription_status === 'active' ? 'default' : 'secondary'}>
                    {company.subscription_status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Stripe Amount:</span>
                    <span className="ml-2 font-mono">
                      {company.stripe_data?.amount 
                        ? `${company.stripe_data.amount} centavos (R$ ${(company.stripe_data.amount / 100).toFixed(2)})`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Local Price:</span>
                    <span className="ml-2 font-mono">
                      {company.subscription_plan_data?.price 
                        ? `R$ ${company.subscription_plan_data.price}`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Plano Stripe:</span>
                    <span className="ml-2">
                      {company.stripe_data?.plan_name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Plano Local:</span>
                    <span className="ml-2">
                      {company.subscription_plan_data?.name || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Valor final usado */}
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <span className="text-sm font-medium text-gray-700">Valor Final Usado: </span>
                  <span className="font-mono text-sm">
                    R$ {
                      company.stripe_data?.amount 
                        ? (company.stripe_data.amount / 100).toFixed(2)
                        : company.subscription_plan_data?.price?.toFixed(2) || '0.00'
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 