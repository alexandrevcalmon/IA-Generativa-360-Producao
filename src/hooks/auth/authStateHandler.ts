
import { Session, User } from '@supabase/supabase-js';
import { fetchUserRoleAuxiliaryData } from './userRoleService';
import { createSessionValidationService } from './sessionValidationService';

interface AuthStateHandlerProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setUserRole: (role: string | null) => void;
  setNeedsPasswordChange: (needs: boolean) => void;
  setCompanyUserData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;
  clearUserState: () => void;
}

export function createAuthStateHandler(props: AuthStateHandlerProps) {
  const {
    setSession,
    setUser,
    setUserRole,
    setNeedsPasswordChange,
    setCompanyUserData,
    setLoading,
    setIsInitialized,
    clearUserState,
  } = props;

  const sessionService = createSessionValidationService();

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('🔐 Enhanced auth state change:', { 
      event, 
      userEmail: session?.user?.email, 
      hasSession: !!session,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
    });
    
    if (event === 'SIGNED_OUT' || !session?.user) {
      console.log('🚪 User signed out or no session, clearing state');
      clearUserState();
      setLoading(false);
      setIsInitialized(true);
      return;
    }
    
    if (event === 'TOKEN_REFRESHED') {
      console.log('🔄 Token refreshed, updating session');
      setSession(session);
      setUser(session.user);
      return; // Don't refetch user data on token refresh
    }
    
    // For SIGNED_IN events, validate session before proceeding
    if (event === 'SIGNED_IN') {
      const validation = await sessionService.validateSession(session);
      
      if (!validation.isValid) {
        if (validation.needsRefresh) {
          console.log('🔄 New session needs refresh, attempting...');
          const refreshResult = await sessionService.refreshSession();
          
          if (refreshResult.isValid && refreshResult.session) {
            console.log('✅ Session refreshed during sign-in');
            session = refreshResult.session;
          } else {
            console.log('❌ Session refresh failed during sign-in, clearing state');
            clearUserState();
            setLoading(false);
            setIsInitialized(true);
            return;
          }
        } else {
          console.log('❌ Invalid session during sign-in, clearing state');
          clearUserState();
          setLoading(false);
          setIsInitialized(true);
          return;
        }
      }
    }
    
    // Update session and user immediately
    setSession(session);
    setUser(session.user);
    
    // Fetch role data asynchronously with improved error handling
    setTimeout(async () => {
      try {
        const user = session.user as User;
        console.log('👤 Determining role and fetching auxiliary data for:', user.email);
        
        const auxData = await fetchUserRoleAuxiliaryData(user);
        
        console.log('🔍 Role determination result:', {
          userEmail: user.email,
          determinedRole: auxData.role,
          needsPasswordChange: auxData.needsPasswordChange,
          hasCompanyData: !!auxData.companyData,
          hasCollaboratorData: !!auxData.collaboratorData,
          hasProfileData: !!auxData.profileData
        });

        // Set role with fallback
        const finalRole = auxData.role || 'student';
        setUserRole(finalRole);

        // Set password change requirement
        setNeedsPasswordChange(auxData.needsPasswordChange || false);

        // Set company user data based on role
        if (finalRole === 'company') {
          setCompanyUserData(auxData.companyData);
        } else if (finalRole === 'collaborator') {
          setCompanyUserData(auxData.collaboratorData);
        } else {
          setCompanyUserData(null);
        }

      } catch (error) {
        console.error('❌ Error loading user auxiliary data:', error);
        // Set safe defaults on error
        setUserRole('student');
        setNeedsPasswordChange(false);
        setCompanyUserData(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    }, 0);
  };

  return { handleAuthStateChange };
}
