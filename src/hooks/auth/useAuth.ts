
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useAuthRedirects } from './useAuthRedirects';

export function useAuth() {
  const authState = useAuthState();
  const { user, userRole, userRoleInfo, loading } = authState;
  
  const authMethods = useAuthMethods(authState);

  // Use auth redirects for general navigation
  useAuthRedirects({ user, userRole, loading });

  return {
    user,
    userRole,
    userRoleInfo,
    loading,
    session: authState.session,
    needsPasswordChange: authState.needsPasswordChange,
    companyUserData: authState.companyUserData,
    isProducer: userRole === 'producer',
    isCompany: userRole === 'company',
    isStudent: userRole === 'student',
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
