
import { Session, User } from '@supabase/supabase-js';
import { fetchUserRoleAuxiliaryData } from './userRoleService';
import { createSessionValidationService } from './sessionValidationService';
import { useNavigate } from 'react-router-dom';

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
    console.log('🔐 Enhanced auth state change with recovery:', { 
      event, 
      userEmail: session?.user?.email, 
      hasSession: !!session,
      timestamp: new Date().toISOString()
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
      return;
    }
    
    // For SIGNED_IN events, validate session with enhanced error handling
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
            console.log('❌ Session refresh failed during sign-in');
            
            // Check if auth failure requires redirect
            if (refreshResult.error?.includes('Authentication required')) {
              console.log('🔄 Redirecting to login due to auth failure');
              clearUserState();
              setLoading(false);
              setIsInitialized(true);
              // Force redirect to auth page
              window.location.href = '/auth';
              return;
            }
            
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
    
    // Fetch role data with enhanced error handling
    try {
      const user = session.user as User;
      console.log('👤 Fetching auxiliary data with recovery mechanisms for:', user.email);
      
      const auxData = await fetchUserRoleAuxiliaryData(user);
      
      console.log('🔍 Role determination result:', {
        userEmail: user.email,
        determinedRole: auxData.role,
        needsPasswordChange: auxData.needsPasswordChange
      });

      // Set password change flag first
      const passwordChangeNeeded = auxData.needsPasswordChange || false;
      console.log('🔐 Setting password change flag:', passwordChangeNeeded);
      setNeedsPasswordChange(passwordChangeNeeded);

      // Set role with fallback
      const finalRole = auxData.role || 'student';
      console.log('👤 Setting user role:', finalRole);
      setUserRole(finalRole);

      // Set company user data based on role
      if (finalRole === 'company') {
        console.log('🏢 Setting company data');
        setCompanyUserData(auxData.companyData);
      } else if (finalRole === 'collaborator') {
        console.log('👥 Setting collaborator data');
        setCompanyUserData(auxData.collaboratorData);
      } else {
        console.log('🎓 Clearing company data for student/producer role');
        setCompanyUserData(null);
      }

      setTimeout(() => {
        console.log('✅ Enhanced auth state initialization completed');
        setLoading(false);
        setIsInitialized(true);
      }, 100);

    } catch (error) {
      console.error('❌ Error loading user auxiliary data:', error);
      
      // Check if auth failure requires redirect
      if (error?.message?.includes('Authentication required')) {
        console.log('🔄 Redirecting to login due to auxiliary data auth failure');
        clearUserState();
        setLoading(false);
        setIsInitialized(true);
        window.location.href = '/auth';
        return;
      }
      
      // Set safe defaults on other errors
      console.log('🛡️ Setting safe defaults due to error');
      setNeedsPasswordChange(false);
      setUserRole('student');
      setCompanyUserData(null);
      
      setTimeout(() => {
        setLoading(false);
        setIsInitialized(true);
      }, 100);
    }
  };

  return { handleAuthStateChange };
}
