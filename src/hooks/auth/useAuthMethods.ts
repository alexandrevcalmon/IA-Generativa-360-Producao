
import { useToast } from '@/hooks/use-toast';
import { createAuthService } from './authService';
import { fetchUserRole } from './userRoleService';
import { createSessionValidationService } from './sessionValidationService';

interface UseAuthMethodsProps {
  user: any;
  companyUserData: any;
  setUser: (user: any) => void;
  setSession: (session: any) => void;
  setUserRole: (role: string | null) => void;
  setNeedsPasswordChange: (needs: boolean) => void;
  setCompanyUserData: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

export function useAuthMethods({
  user,
  companyUserData,
  setUser,
  setSession,
  setUserRole,
  setNeedsPasswordChange,
  setCompanyUserData,
  setLoading,
}: UseAuthMethodsProps) {
  const { toast } = useToast();
  const authService = createAuthService(toast);
  const sessionService = createSessionValidationService();

  const refreshUserRole = async () => {
    if (!user) {
      console.log('⚠️ No user available for role refresh');
      return;
    }
    
    console.log('🔄 Refreshing user role for:', user.email);
    try {
      const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(user.id);
      setUserRole(role);
      setNeedsPasswordChange(needsChange);
      setCompanyUserData(userData);
      console.log('✅ User role refreshed:', { role, needsChange, hasUserData: !!userData });
    } catch (error) {
      console.error('❌ Error refreshing user role:', error);
      // Set default role on error
      setUserRole('student');
      setNeedsPasswordChange(false);
      setCompanyUserData(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting enhanced sign in for:', email);
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password);
      
      if (result.user && !result.error) {
        console.log('✅ Sign in successful, validating session...');
        
        // Validate the session immediately after sign in
        const validation = await sessionService.validateSession();
        
        if (!validation.isValid) {
          console.error('❌ Session validation failed after sign in');
          setLoading(false);
          return { error: { message: 'Session validation failed' } };
        }
        
        // Check if authService already determined needsPasswordChange
        if (result.needsPasswordChange) {
          console.log('🔐 Password change required from authService');
          
          // Fetch user role for proper setup
          const { role, companyUserData: userData } = await fetchUserRole(result.user.id);
          
          setUser(result.user);
          setSession(result.session);
          setUserRole(role);
          setNeedsPasswordChange(true);
          setCompanyUserData(userData);
          
          setLoading(false);
          return { error: null, needsPasswordChange: true };
        } else {
          // Normal login flow - fetch role and check for password change requirement
          const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(result.user.id);
          
          setUser(result.user);
          setSession(result.session);
          setUserRole(role);
          setNeedsPasswordChange(needsChange);
          setCompanyUserData(userData);
          
          console.log('✅ Sign in complete:', { role, needsChange, hasUserData: !!userData });
          
          setLoading(false);
          return { error: null, needsPasswordChange: needsChange };
        }
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setLoading(false);
      return { error };
    }
  };

  const changePassword = async (newPassword: string) => {
    const result = await authService.changePassword(newPassword, user?.id, companyUserData);
    
    if (!result.error && companyUserData) {
      setNeedsPasswordChange(false);
      console.log('✅ Password changed, needs_password_change set to false');
    }
    
    return result;
  };

  const signOut = async () => {
    console.log('🚪 Enhanced AuthProvider signOut called');
    
    try {
      const result = await authService.signOut();
      
      if (!result.error) {
        console.log('✅ SignOut successful, clearing local state');
        // Auth state change will handle clearing state, but also clear immediately
        setUser(null);
        setSession(null);
        setUserRole(null);
        setNeedsPasswordChange(false);
        setCompanyUserData(null);
      } else {
        console.error('❌ SignOut error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('💥 SignOut error:', error);
      // Force local cleanup on any error
      sessionService.clearLocalSession();
      setUser(null);
      setSession(null);
      setUserRole(null);
      setNeedsPasswordChange(false);
      setCompanyUserData(null);
      return { error: null }; // Return success to allow navigation
    }
  };

  return {
    signIn,
    signUp: authService.signUp,
    signOut,
    changePassword,
    resetPassword: authService.resetPassword,
    refreshUserRole,
  };
}
