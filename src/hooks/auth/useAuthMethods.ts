
import { useToast } from '@/hooks/use-toast';
import { createAuthService } from './authService';
import { fetchUserRoleAuxiliaryData } from './userRoleService';
import { createSessionValidationService } from './sessionValidationService';
import { createSessionCleanupService } from './sessionCleanupService';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthMethodsProps {
  user: User | null;
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
      // Clear session cache for this user to ensure fresh data
      sessionService.clearCache(user.id);
      
      // Use the improved role determination service
      const auxData = await fetchUserRoleAuxiliaryData(user);
      
      const finalRole = auxData.role || 'student';
      setUserRole(finalRole);

      // Set company data based on role
      if (finalRole === 'company') {
        setCompanyUserData(auxData.companyData);
      } else if (finalRole === 'collaborator') {
        setCompanyUserData(auxData.collaboratorData);
      } else {
        setCompanyUserData(null);
      }
      
      console.log('✅ User role refreshed:', finalRole, { 
        hasCompanyData: !!auxData.companyData, 
        hasCollaboratorData: !!auxData.collaboratorData,
        hasProducerData: !!auxData.producerData
      });
    } catch (error) {
      console.error('❌ Error refreshing user role:', error);
      // Set safe defaults
      setUserRole('student');
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
        
        // Clear any existing cache to ensure fresh validation
        sessionService.clearCache(result.user.id);
        
        // Validate the session immediately after sign in
        const validation = await sessionService.validateSession(result.session);
        
        if (!validation.isValid && !validation.needsRefresh) {
          console.error('❌ Session validation failed after sign in');
          setLoading(false);
          return { error: { message: 'Session validation failed' } };
        }
        
        // Handle password change requirement
        if (result.needsPasswordChange) {
          console.log('🔐 Password change required from authService');
          
          const authUser = result.user as User;
          
          // Get role and auxiliary data with improved error handling
          try {
            const auxData = await fetchUserRoleAuxiliaryData(authUser);
            const finalRole = auxData.role || authUser.user_metadata?.role || 'student';
            
            setUserRole(finalRole);
            
            if (finalRole === 'company') {
              setCompanyUserData(auxData.companyData);
            } else if (finalRole === 'collaborator') {
              setCompanyUserData(auxData.collaboratorData);
            } else {
              setCompanyUserData(null);
            }
          } catch (auxError) {
            console.error('❌ Error fetching auxiliary data during password change flow:', auxError);
            // Set safe defaults
            setUserRole(authUser.user_metadata?.role || 'student');
            setCompanyUserData(null);
          }

          setUser(authUser);
          setSession(result.session);
          setNeedsPasswordChange(true);
          
          setLoading(false);
          return { error: null, needsPasswordChange: true };
        } else {
          // Normal login flow
          const authUser = result.user as User;
          
          try {
            const auxData = await fetchUserRoleAuxiliaryData(authUser);
            const finalRole = auxData.role || authUser.user_metadata?.role || 'student';
            
            console.log('👤 User role determined:', finalRole, 'for user:', authUser.email);
            
            setUserRole(finalRole);
            setNeedsPasswordChange(result.needsPasswordChange || false);

            if (finalRole === 'company') {
              setCompanyUserData(auxData.companyData);
            } else if (finalRole === 'collaborator') {
              setCompanyUserData(auxData.collaboratorData);
            } else {
              setCompanyUserData(null);
            }
          } catch (auxError) {
            console.error('❌ Error fetching auxiliary data during normal login:', auxError);
            // Set safe defaults
            setUserRole(authUser.user_metadata?.role || 'student');
            setCompanyUserData(null);
          }
          
          setUser(authUser);
          setSession(result.session);
          
          console.log('✅ Sign in complete');
          
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
    const result = await authService.changePassword(newPassword);
    
    if (!result.error && companyUserData) {
      setNeedsPasswordChange(false);
      console.log('✅ Password changed, needs_password_change set to false');
    }
    
    return result;
  };

  const signOut = async () => {
    console.log('🚪 Enhanced AuthProvider signOut called');
    
    try {
      // Clear session cache before sign out
      if (user) {
        sessionService.clearCache(user.id);
      }
      
      const result = await authService.signOut();
      
      if (!result.error) {
        console.log('✅ SignOut successful, clearing local state');
        // Clear state immediately
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
      sessionService.clearCache();
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
