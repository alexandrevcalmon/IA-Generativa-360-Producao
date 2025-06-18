
import { useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserRoleAuxiliaryData } from './userRoleService';
import { useAuthState } from './useAuthState';
import { createSessionValidationService } from './sessionValidationService';
import { createSessionCleanupService } from './sessionCleanupService';

export function useAuthInitialization() {
  const authState = useAuthState();
  const sessionService = createSessionValidationService();
  const cleanupService = createSessionCleanupService();
  
  const {
    setSession,
    setUser,
    setUserRole,
    setNeedsPasswordChange,
    setCompanyUserData,
    setLoading,
    setIsInitialized,
    clearUserState,
  } = authState;

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
    
    // Fetch role data asynchronously to avoid blocking
    setTimeout(async () => {
      try {
        const user = session.user as User; // session.user should be full User object
        console.log('👤 Setting role from metadata and fetching auxiliary data for:', user.email);
        
        const primaryRole = user.user_metadata?.role || 'student';
        setUserRole(primaryRole);
        // needsPasswordChange is primarily set by signIn and managed by AuthProvider's state.
        // fetchUserRoleAuxiliaryData no longer returns it.

        const auxData = await fetchUserRoleAuxiliaryData(user);

        if (primaryRole === 'company') {
          setCompanyUserData(auxData.companyData);
          console.log('✅ Company auxiliary data loaded for:', user.email, auxData.companyData);
        } else if (primaryRole === 'collaborator') {
          // companyUserData previously held collaborator info including nested company
          setCompanyUserData(auxData.collaboratorData);
          console.log('✅ Collaborator auxiliary data loaded for:', user.email, auxData.collaboratorData);
        } else {
          setCompanyUserData(null);
        }
        // console.log('Profile data:', auxData.profileData); // Available if needed

      } catch (error) {
        console.error('❌ Error loading user auxiliary data:', error);
        // Set safe defaults - role is already set from metadata
        setCompanyUserData(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    }, 0);
  };

  useEffect(() => {
    console.log('🚀 Initializing Enhanced AuthProvider with improved session management...');
    let isMounted = true;
    let refreshTimer: NodeJS.Timeout | null = null;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      await handleAuthStateChange(event, session);
    });

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const validation = await sessionService.validateSession();
        
        if (!validation.isValid && validation.needsRefresh) {
          console.log('🔄 Session expired during init, attempting refresh...');
          const refreshResult = await sessionService.refreshSession();
          
          if (refreshResult.isValid && refreshResult.session && isMounted) {
            console.log('✅ Session refreshed during initialization');
            await handleAuthStateChange('SIGNED_IN', refreshResult.session);
            return;
          }
        }
        
        if (validation.isValid && validation.session && isMounted) {
          console.log('✅ Found valid existing session');
          await handleAuthStateChange('SIGNED_IN', validation.session);
        } else {
          console.log('ℹ️ No valid session found during initialization');
          if (isMounted) {
            setLoading(false);
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error('💥 Error during auth initialization:', error);
        if (isMounted) {
          clearUserState();
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up periodic session monitoring with more intelligent timing
    const setupSessionMonitoring = () => {
      const checkSession = async () => {
        if (!isMounted) return;
        
        const validation = await sessionService.validateSession();
        
        if (!validation.isValid) {
          if (validation.needsRefresh) {
            console.log('🔄 Session expired during monitoring, attempting refresh...');
            const refreshResult = await sessionService.refreshSession();
            
            if (!refreshResult.isValid) {
              console.log('❌ Session refresh failed during monitoring, clearing state...');
              clearUserState();
            }
          } else if (validation.session) {
            // Session exists but is invalid (not just expired)
            console.log('⚠️ Invalid session detected during monitoring, clearing state...');
            clearUserState();
          }
        }
      };
      
      // Check every 2 minutes instead of 5 for better responsiveness
      refreshTimer = setInterval(checkSession, 2 * 60 * 1000);
    };

    initializeAuth();
    setupSessionMonitoring();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, []);

  return authState;
}
