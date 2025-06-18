
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useAuthRedirects } from './useAuthRedirects';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, userRole, loading, needsPasswordChange } = context;

  // Use auth redirects for general navigation
  useAuthRedirects({ user, userRole, loading, needsPasswordChange });

  return context;
}

interface UseAuthWithRedirectProps {
  targetRole: string;
}

export function useAuthWithRedirect({ targetRole }: UseAuthWithRedirectProps) {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthWithRedirect must be used within an AuthProvider');
  }

  const { user, userRole, loading, needsPasswordChange } = context;

   // Use auth redirects for specific role-based navigation
  useAuthRedirects({ user, userRole, loading, targetRole, needsPasswordChange });

  return context;
}
