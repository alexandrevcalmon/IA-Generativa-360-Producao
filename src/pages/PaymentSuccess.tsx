import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle, Building2, Users, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setError('ID da sessão não encontrado');
      setLoading(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data.success) {
        setSuccess(true);
        setCompanyData(data);
        toast({
          title: "Pagamento confirmado!",
          description: "Sua empresa foi criada com sucesso",
        });
      } else {
        throw new Error('Falha na verificação do pagamento');
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      setError(error.message || 'Erro ao verificar pagamento');
      toast({
        title: "Erro",
        description: "Não foi possível verificar o pagamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/auth?redirect=/company-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verificando pagamento...</h2>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Aguarde enquanto confirmamos sua transação
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-red-800 dark:text-red-400">Erro no Pagamento</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Houve um problema ao processar seu pagamento. Entre em contato conosco para resolver esta questão.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/plans')} className="w-full">
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <Card className="mb-8">
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-3xl text-green-800 dark:text-green-400 mb-2">
                  Pagamento Confirmado!
                </CardTitle>
                <CardDescription className="text-lg">
                  Sua empresa foi criada com sucesso e sua assinatura está ativa
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Success Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Empresa Criada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>ID da Empresa:</strong> {companyData?.companyId}</p>
                    <p><strong>Status:</strong> 
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Ativa
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Assinatura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> 
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {companyData?.subscriptionStatus === 'active' ? 'Ativa' : companyData?.subscriptionStatus}
                      </span>
                    </p>
                    <p><strong>Tipo:</strong> Mensal</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
                <CardDescription>O que você pode fazer agora</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-1">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Acesse o Dashboard</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Faça login com suas credenciais para acessar o painel de controle da empresa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-1">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Configure sua Empresa</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Complete as informações da empresa e personalize sua experiência
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1 mt-1">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Adicione Colaboradores</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Comece a adicionar seus colaboradores para que possam acessar os cursos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-400">Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Você receberá um email de confirmação com os detalhes da sua assinatura</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Sua cobrança será processada mensalmente de forma automática</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Você pode cancelar sua assinatura a qualquer momento através do dashboard</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <p>Em caso de dúvidas, entre em contato com nosso suporte: contato@calmonacademy.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <Button 
                onClick={handleGoToDashboard}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Acessar Dashboard
              </Button>
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Voltar ao Início
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => window.open('mailto:contato@calmonacademy.com', '_blank')}
                >
                  Suporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;