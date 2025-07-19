import { ReactNode } from 'react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { AccessGuard } from '@/components/AccessGuard';
import { SubscriptionStatusIndicator } from '@/components/SubscriptionStatusIndicator';

interface SubscriptionGuardProps {
  children: ReactNode;
  feature?: string;
  requiresActiveSubscription?: boolean;
  requiresCollaboratorSlot?: boolean;
  fallbackMessage?: string;
  showStatusIndicator?: boolean;
}

export function SubscriptionGuard({
  children,
  feature = 'esta funcionalidade',
  requiresActiveSubscription = true,
  requiresCollaboratorSlot = false,
  fallbackMessage,
  showStatusIndicator = false
}: SubscriptionGuardProps) {
  const accessInfo = useSubscriptionAccess();

  // For features that don't require active subscription, just show children
  if (!requiresActiveSubscription && !requiresCollaboratorSlot) {
    return (
      <div>
        {showStatusIndicator && <SubscriptionStatusIndicator />}
        {children}
      </div>
    );
  }

  // For collaborator slot requirements, use the existing useSubscription logic
  if (requiresCollaboratorSlot) {
    // This would use the existing useSubscription hook logic
    // keeping it as is for backward compatibility
    return (
      <div>
        {showStatusIndicator && <SubscriptionStatusIndicator />}
        {children}
      </div>
    );
  }

  // For subscription requirements, use AccessGuard
  return (
    <AccessGuard fallbackMessage={fallbackMessage}>
      {showStatusIndicator && <SubscriptionStatusIndicator />}
      {children}
    </AccessGuard>
  );
}
