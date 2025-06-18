
import { useToast } from '@/hooks/use-toast';
import { createAuthService } from './authService';
import { fetchUserRoleAuxiliaryData } from './userRoleService';
import { createSessionValidationService } from './sessionValidationService';
import { createSessionCleanupService } from './sessionCleanupService';
import { User } from '@supabase/supabase-js';

interface UseAuthMethodsProps {
  user: User | null; // Updated to use User type
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
  const cleanupService = createSessionCleanupService();

  const refreshUserRole = async () => {
    if (!user) {
      console.log('⚠️ No user available for role refresh');
      return;
    }
    
    console.log('🔄 Refreshing user role for:', user.email);
    try {
      const primaryRole = user.user_metadata?.role || 'student';
      setUserRole(primaryRole);
      // needsPasswordChange state is managed by direct results from signIn or changePassword.

      const auxData = await fetchUserRoleAuxiliaryData(user);
      if (primaryRole === 'company') {
        setCompanyUserData(auxData.companyData);
      } else if (primaryRole === 'collaborator') {
        setCompanyUserData(auxData.collaboratorData);
      } else {
        setCompanyUserData(null);
      }
      console.log('✅ User auxiliary data refreshed for role:', primaryRole, { hasCompanyData: !!auxData.companyData, hasCollaboratorData: !!auxData.collaboratorData });
    } catch (error) {
      console.error('❌ Error refreshing user auxiliary data:', error);
      // Role is already set from metadata, set companyUserData to null on error
      setCompanyUserData(null);
    }
  };

  const signIn = async (email: string, password: string, role?: string) => {
    console.log('🔑 Starting enhanced sign in for:', email, 'with role:', role);
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password, role);
      
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
          
          // Role and auxiliary data setup
          const authUser = result.user as User;
          const primaryRole = authUser.user_metadata?.role || 'student';
          setUserRole(primaryRole);
          
          const auxData = await fetchUserRoleAuxiliaryData(authUser);
          if (primaryRole === 'company') {
            setCompanyUserData(auxData.companyData);
          } else if (primaryRole === 'collaborator') {
            setCompanyUserData(auxData.collaboratorData);
          } else {
            setCompanyUserData(null);
          }

          setUser(authUser);
          setSession(result.session);
          setNeedsPasswordChange(true); // This is from signIn result
          
          setLoading(false);
          return { error: null, needsPasswordChange: true };
        } else {
          // Normal login flow - set role from metadata, fetch auxiliary data
          const authUser = result.user as User;
          const primaryRole = authUser.user_metadata?.role || 'student';
          setUserRole(primaryRole);

          // needsPasswordChange from signIn result is false here, or not present.
          // Rely on the needsPasswordChange from the signIn result (which should be false or undefined)
          setNeedsPasswordChange(result.needsPasswordChange || false);


          const auxData = await fetchUserRoleAuxiliaryData(authUser);
          if (primaryRole === 'company') {
            setCompanyUserData(auxData.companyData);
          } else if (primaryRole === 'collaborator') {
            setCompanyUserData(auxData.collaboratorData);
          } else {
            setCompanyUserData(null);
          }
          
          setUser(authUser);
          setSession(result.session);
          
          console.log('✅ Sign in complete. Role:', primaryRole, { needsPasswordChange: result.needsPasswordChange, hasCompanyData: !!auxData.companyData, hasCollaboratorData: !!auxData.collaboratorData });
          
          setLoading(false);
          return { error: null, needsPasswordChange: result.needsPasswordChange || false };
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
      cleanupService.clearLocalSession();
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
