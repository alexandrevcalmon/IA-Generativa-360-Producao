
import React from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

interface SubscriptionStatusIndicatorProps {
  showDetailedInfo?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

export function SubscriptionStatusIndicator({
  showDetailedInfo = false,
  showActions = false,
  compact = false
}: SubscriptionStatusIndicatorProps) {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const accessInfo = useSubscriptionAccess();

  // Don't show for producers or students
  if (userRole === 'producer' || userRole === 'student') {
    return null;
  }

  if (accessInfo.isLoading) {
    return compact ? (
      <Badge variant="outline">
        <Clock className="h-3 w-3 mr-1" />
        Verificando...
      </Badge>
    ) : null;
  }

  const getStatusIcon = () => {
    if (accessInfo.hasAccess) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (accessInfo.daysUntilExpiry !== null && accessInfo.daysUntilExpiry <= 7) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (accessInfo.hasAccess) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ativa
        </Badge>
      );
    }

    if (accessInfo.daysUntilExpiry !== null && accessInfo.daysUntilExpiry > 0) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expira em {accessInfo.daysUntilExpiry} dia{accessInfo.daysUntilExpiry !== 1 ? 's' : ''}
        </Badge>
      );
    }

    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        {accessInfo.subscriptionStatus === 'canceled' ? 'Cancelada' :
         accessInfo.subscriptionStatus === 'past_due' ? 'Pagamento Pendente' :
         'Inativa'}
      </Badge>
    );
  };

  if (compact) {
    return getStatusBadge();
  }

  const shouldShowWarning = !accessInfo.hasAccess || 
    (accessInfo.daysUntilExpiry !== null && accessInfo.daysUntilExpiry <= 7);

  if (!shouldShowWarning && !showDetailedInfo) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status da Assinatura:</span>
        {getStatusBadge()}
      </div>

      {/* Detailed Information */}
      {showDetailedInfo && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          {accessInfo.companyName && (
            <div>
              <span className="text-muted-foreground">Empresa:</span>
              <p className="font-medium">{accessInfo.companyName}</p>
            </div>
          )}
          
          {accessInfo.subscriptionEndsAt && (
            <div>
              <span className="text-muted-foreground">Renovação:</span>
              <p className="font-medium">
                {new Date(accessInfo.subscriptionEndsAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Warning Alert */}
      {shouldShowWarning && (
        <Alert variant={!accessInfo.hasAccess ? 'destructive' : 'default'}>
          {getStatusIcon()}
          <AlertDescription>
            {!accessInfo.hasAccess ? (
              userRole === 'company' ? (
                'Sua assinatura está inativa. Renove para continuar acessando todas as funcionalidades.'
              ) : (
                'A assinatura da sua empresa está inativa. Entre em contato com o administrador.'
              )
            ) : accessInfo.daysUntilExpiry !== null && accessInfo.daysUntilExpiry <= 7 ? (
              `Sua assinatura expira em ${accessInfo.daysUntilExpiry} dia${accessInfo.daysUntilExpiry !== 1 ? 's' : ''}. Renove para evitar interrupções.`
            ) : null}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      {showActions && shouldShowWarning && userRole === 'company' && (
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/planos')}
            size="sm"
            variant={!accessInfo.hasAccess ? 'default' : 'outline'}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {!accessInfo.hasAccess ? 'Renovar Assinatura' : 'Ver Planos'}
          </Button>

          {accessInfo.subscriptionStatus === 'past_due' && (
            <Button
              onClick={() => window.open('https://billing.stripe.com/p/login/test_123', '_blank')}
              size="sm"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2" />
              Atualizar Pagamento
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
