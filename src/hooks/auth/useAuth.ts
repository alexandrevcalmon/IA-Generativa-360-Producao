import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useAuthRedirects } from './useAuthRedirects';

export function useAuth() {
  const { user, userRole, userRoleInfo, loading } = useAuthState();
  const authMethods = useAuthMethods();

  // Use auth redirects for general navigation
  useAuthRedirects({ user, userRole, loading });

  return {
    user,
    userRole,
    userRoleInfo,
    loading,
    ...authMethods,
  };
}

interface UseAuthWithRedirectProps {
  targetRole: string;
}

export function useAuthWithRedirect({ targetRole }: UseAuthWithRedirectProps) {
  const { user, userRole, userRoleInfo, loading, ...authMethods } = useAuth();

   // Use auth redirects for specific role-based navigation
  useAuthRedirects({ user, userRole, loading, targetRole });

  return {
    user,
    userRole,
    userRoleInfo,
    loading,
    ...authMethods,
  };
}
