import { PageLayout } from "@/components/PageLayout";
import { SubscriptionAnalyticsDashboard } from "@/components/SubscriptionAnalyticsDashboard";
import { StripeMetricsSummary } from "@/components/StripeMetricsSummary";
import { SubscriptionDebugInfo } from "@/components/SubscriptionDebugInfo";
import { useCompanySubscriptionReports } from "@/hooks/useCompanySubscriptionReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Users,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProducerSubscriptionAnalytics = () => {
  const { data, isLoading, error, refetch } = useCompanySubscriptionReports();
  return (
    <PageLayout
      title="Analytics de Assinaturas"
      subtitle="Monitore o status das assinaturas das empresas"
      headerContent={
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-calmon-600" />
          <Badge variant="secondary">Relatórios em Tempo Real</Badge>
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-calmon-600" />
            <span className="ml-3 text-gray-600">Carregando dados do Stripe...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        ) : data ? (
          <>
            {/* Layout com Métricas do Stripe */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Métricas do Stripe */}
              <div className="lg:col-span-1">
                <StripeMetricsSummary summary={data.summary} />
              </div>

              {/* Dashboard Principal */}
              <div className="lg:col-span-2">
                <SubscriptionAnalyticsDashboard />
              </div>
            </div>

            {/* Debug Info */}
            <SubscriptionDebugInfo companies={data.companies} summary={data.summary} />
          </>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
            <p className="text-gray-600">Não há empresas cadastradas ainda.</p>
          </div>
        )}

        {/* Informações Adicionais */}
        {data && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximos Vencimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Empresas com vencimento nos próximos 7 dias
                </p>
                <div className="space-y-2">
                  {data.atRiskCompanies.length > 0 ? (
                    data.atRiskCompanies.slice(0, 5).map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm font-medium">{company.name}</span>
                        <Badge variant="secondary">{company.days_until_expiry} dias</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium text-green-700">Nenhuma empresa em risco</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Ações Necessárias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ações recomendadas para manter a saúde financeira
                </p>
                <div className="space-y-2">
                  {data.overdueCompanies.length > 0 && (
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm font-medium text-red-700">
                        {data.overdueCompanies.length} empresa(s) em atraso
                      </span>
                      <Badge variant="destructive">Urgente</Badge>
                    </div>
                  )}
                  {data.summary.churnRate > 5 && (
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm font-medium text-orange-700">
                        Taxa de churn alta ({data.summary.churnRate.toFixed(1)}%)
                      </span>
                      <Badge variant="secondary">Atenção</Badge>
                    </div>
                  )}
                  {data.overdueCompanies.length === 0 && data.summary.churnRate <= 5 && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium text-green-700">Tudo em ordem</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legenda */}
        <Card>
          <CardHeader>
            <CardTitle>Legenda dos Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                <span className="text-sm text-gray-600">Assinatura em dia</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">Pagamento Pendente</Badge>
                <span className="text-sm text-gray-600">Pagamento em atraso</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
                <span className="text-sm text-gray-600">Assinatura cancelada</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">Período de Teste</Badge>
                <span className="text-sm text-gray-600">Em período de teste</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">Cancelamento Programado</Badge>
                <span className="text-sm text-gray-600">Será cancelada no final do período</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">Em Risco</Badge>
                <span className="text-sm text-gray-600">Vence em ≤ 7 dias</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Os dados são atualizados em tempo real via Stripe. 
                Use o botão "Atualizar" para sincronizar as informações mais recentes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProducerSubscriptionAnalytics; 