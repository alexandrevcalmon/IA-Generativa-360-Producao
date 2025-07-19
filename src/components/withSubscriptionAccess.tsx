
import React from 'react';
import { AccessGuard } from '@/components/AccessGuard';

interface WithSubscriptionAccessOptions {
  fallbackMessage?: string;
  showCompanyInfo?: boolean;
}

export function withSubscriptionAccess<P extends object>(
  Component: React.ComponentType<P>,
  options: WithSubscriptionAccessOptions = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <AccessGuard {...options}>
        <Component {...props} />
      </AccessGuard>
    );
  };

  WrappedComponent.displayName = `withSubscriptionAccess(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
