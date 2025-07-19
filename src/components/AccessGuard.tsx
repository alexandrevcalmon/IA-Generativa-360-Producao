
import React from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Users, 
  AlertTriangle, 
  Loader2, 
  Building2,
  Clock,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

interface AccessGuardProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  showCompanyInfo?: boolean;
}

export function AccessGuard({ 
  children, 
  fallbackMessage,
  showCompanyInfo = true 
}: AccessGuardProps) {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const accessInfo = useSubscriptionAccess();

  if (accessInfo.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!accessInfo.hasAccess && accessInfo.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              {accessInfo.blockReason === 'authentication_required' ? (
                <XCircle className="h-8 w-8 text-destructive" />
              ) : accessInfo.blockReason?.includes('company') ? (
                <Building2 className="h-8 w-8 text-destructive" />
              ) : (
                <CreditCard className="h-8 w-8 text-destructive" />
              )}
            </div>
            <CardTitle className="text-xl">
              {accessInfo.blockReason === 'authentication_required' ? 'Acesso Negado' :
               accessInfo.blockReason === 'no_subscription' ? 'Assinatura Necessária' :
               accessInfo.blockReason === 'subscription_inactive' ? 'Assinatura Inativa' :
               accessInfo.blockReason === 'subscription_expired' ? 'Assinatura Expirada' :
               accessInfo.blockReason === 'company_inactive' ? 'Empresa Inativa' :
               accessInfo.blockReason === 'company_subscription_inactive' ? 'Assinatura da Empresa Inativa' :
               accessInfo.blockReason === 'company_subscription_expired' ? 'Assinatura da Empresa Expirada' :
               'Acesso Bloqueado'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Company Information */}
            {showCompanyInfo && accessInfo.companyName && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Empresa:</span>
                <Badge variant="outline">{accessInfo.companyName}</Badge>
              </div>
            )}

            {/* Subscription Status */}
            {accessInfo.subscriptionStatus && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={
                  accessInfo.subscriptionStatus === 'active' ? 'default' :
                  accessInfo.subscriptionStatus === 'trialing' ? 'secondary' :
                  'destructive'
                }>
                  {accessInfo.subscriptionStatus === 'active' ? 'Ativa' :
                   accessInfo.subscriptionStatus === 'trialing' ? 'Período de Teste' :
                   accessInfo.subscriptionStatus === 'past_due' ? 'Pagamento Pendente' :
                   accessInfo.subscriptionStatus === 'canceled' ? 'Cancelada' :
                   accessInfo.subscriptionStatus}
                </Badge>
              </div>
            )}

            {/* Expiry Information */}
            {accessInfo.subscriptionEndsAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expira em:</span>
                <span className="text-sm">
                  {new Date(accessInfo.subscriptionEndsAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

            {accessInfo.daysUntilExpiry !== null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dias restantes:</span>
                <span className={`text-sm font-medium ${
                  accessInfo.daysUntilExpiry <= 0 ? 'text-destructive' :
                  accessInfo.daysUntilExpiry <= 3 ? 'text-orange-500' :
                  accessInfo.daysUntilExpiry <= 7 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {accessInfo.daysUntilExpiry <= 0 ? 'Expirada' : `${accessInfo.daysUntilExpiry} dia${accessInfo.daysUntilExpiry !== 1 ? 's' : ''}`}
                </span>
              </div>
            )}

            {/* Alert Message */}
            <Alert variant={accessInfo.error ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {fallbackMessage || 
                 (accessInfo.blockReason === 'authentication_required' ? 'Você precisa estar logado para acessar esta página.' :
                  accessInfo.blockReason === 'no_subscription' ? 'Para acessar esta funcionalidade, você precisa de uma assinatura ativa.' :
                  accessInfo.blockReason === 'subscription_inactive' ? 'Sua assinatura está inativa. Renove para continuar acessando a plataforma.' :
                  accessInfo.blockReason === 'subscription_expired' ? 'Sua assinatura expirou. Renove para continuar acessando a plataforma.' :
                  accessInfo.blockReason === 'company_inactive' ? 'Sua empresa não está ativa no sistema.' :
                  accessInfo.blockReason === 'company_subscription_inactive' ? 'A assinatura da sua empresa está inativa. Entre em contato com o administrador.' :
                  accessInfo.blockReason === 'company_subscription_expired' ? 'A assinatura da sua empresa expirou. Entre em contato com o administrador.' :
                  accessInfo.error || 'Acesso bloqueado.')
                }
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              {accessInfo.blockReason === 'authentication_required' ? (
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="w-full"
                >
                  Fazer Login
                </Button>
              ) : userRole === 'company' ? (
                <>
                  <Button
                    onClick={() => navigate('/planos')}
                    className="w-full"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Ver Planos
                  </Button>
                  
                  {accessInfo.subscriptionStatus === 'past_due' && (
                    <Button
                      onClick={() => window.open('https://billing.stripe.com/p/login/test_123', '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Atualizar Pagamento
                    </Button>
                  )}
                </>
              ) : userRole === 'collaborator' ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Entre em contato com o administrador da sua empresa para resolver esta questão.
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  Voltar ao Início
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
