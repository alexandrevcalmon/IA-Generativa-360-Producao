
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useCollaboratorData } from '@/hooks/useCollaboratorData';

interface SubscriptionAccessInfo {
  hasAccess: boolean;
  isBlocked: boolean;
  blockReason?: string;
  companyName?: string;
  subscriptionStatus?: string;
  subscriptionEndsAt?: string;
  daysUntilExpiry?: number;
  isLoading: boolean;
  error?: string;
}

export function useSubscriptionAccess(): SubscriptionAccessInfo {
  const { user, userRole } = useAuth();
  const { data: companyData, isLoading: companyLoading, error: companyError } = useCompanyData();
  const { data: collaboratorData, isLoading: collaboratorLoading, error: collaboratorError } = useCollaboratorData();
  const [accessInfo, setAccessInfo] = useState<SubscriptionAccessInfo>({
    hasAccess: true,
    isBlocked: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAccess = () => {
      // For non-authenticated users or users without roles
      if (!user || !userRole) {
        setAccessInfo({
          hasAccess: false,
          isBlocked: true,
          blockReason: 'authentication_required',
          isLoading: false
        });
        return;
      }

      // For producer users - always have access
      if (userRole === 'producer') {
        setAccessInfo({
          hasAccess: true,
          isBlocked: false,
          isLoading: false
        });
        return;
      }

      // For company users
      if (userRole === 'company') {
        if (companyLoading) {
          setAccessInfo(prev => ({ ...prev, isLoading: true }));
          return;
        }

        if (companyError) {
          setAccessInfo({
            hasAccess: false,
            isBlocked: true,
            blockReason: 'error',
            error: companyError.message,
            isLoading: false
          });
          return;
        }

        if (!companyData) {
          setAccessInfo({
            hasAccess: false,
            isBlocked: true,
            blockReason: 'no_subscription',
            isLoading: false
          });
          return;
        }

        const isActive = companyData.subscription_status === 'active' || companyData.subscription_status === 'trialing';
        const now = new Date();
        const expiryDate = companyData.subscription_ends_at ? new Date(companyData.subscription_ends_at) : null;
        const isNotExpired = !expiryDate || expiryDate > now;
        const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

        const hasAccess = isActive && isNotExpired;

        setAccessInfo({
          hasAccess,
          isBlocked: !hasAccess,
          blockReason: !isActive ? 'subscription_inactive' : 'subscription_expired',
          companyName: companyData.name,
          subscriptionStatus: companyData.subscription_status,
          subscriptionEndsAt: companyData.subscription_ends_at,
          daysUntilExpiry,
          isLoading: false
        });
        return;
      }

      // For collaborator users
      if (userRole === 'collaborator') {
        if (collaboratorLoading) {
          setAccessInfo(prev => ({ ...prev, isLoading: true }));
          return;
        }

        if (collaboratorError) {
          setAccessInfo({
            hasAccess: false,
            isBlocked: true,
            blockReason: 'error',
            error: collaboratorError.message,
            isLoading: false
          });
          return;
        }

        if (!collaboratorData || !collaboratorData.company) {
          setAccessInfo({
            hasAccess: false,
            isBlocked: true,
            blockReason: 'company_inactive',
            isLoading: false
          });
          return;
        }

        const company = collaboratorData.company;
        const isActive = company.subscription_status === 'active' || company.subscription_status === 'trialing';
        const now = new Date();
        const expiryDate = company.subscription_ends_at ? new Date(company.subscription_ends_at) : null;
        const isNotExpired = !expiryDate || expiryDate > now;
        const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

        const hasAccess = isActive && isNotExpired;

        setAccessInfo({
          hasAccess,
          isBlocked: !hasAccess,
          blockReason: !isActive ? 'company_subscription_inactive' : 'company_subscription_expired',
          companyName: company.name,
          subscriptionStatus: company.subscription_status,
          subscriptionEndsAt: company.subscription_ends_at,
          daysUntilExpiry,
          isLoading: false
        });
        return;
      }

      // For student users - default access
      setAccessInfo({
        hasAccess: true,
        isBlocked: false,
        isLoading: false
      });
    };

    checkAccess();
  }, [user, userRole, companyData, companyLoading, companyError, collaboratorData, collaboratorLoading, collaboratorError]);

  return accessInfo;
}
