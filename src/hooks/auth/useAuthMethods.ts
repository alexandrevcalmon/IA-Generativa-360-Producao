
import { useToast } from '@/hooks/use-toast';
import { createAuthService } from './authService';
import { fetchUserRole } from './userRoleService';

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
    console.log('🔑 Starting sign in for:', email);
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password);
      
      if (result.user && !result.error) {
        console.log('✅ Sign in successful, fetching user data...');
        
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
    console.log('🚪 AuthProvider signOut called');
    
    try {
      const result = await authService.signOut();
      
      if (!result.error) {
        console.log('✅ SignOut successful');
        // Auth state change will handle clearing state
      } else {
        console.error('❌ SignOut error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('💥 SignOut error:', error);
      return { error };
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
