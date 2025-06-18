
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserRole } from './userRoleService';
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
        console.log('👤 Fetching user role and data for:', session.user.email);
        const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(session.user.id);
        
        setUserRole(role);
        setNeedsPasswordChange(needsChange);
        setCompanyUserData(userData);
        
        console.log('✅ User data loaded successfully:', { 
          role, 
          needsChange, 
          hasUserData: !!userData,
          userEmail: session.user.email 
        });
      } catch (error) {
        console.error('❌ Error loading user data:', error);
        // Set safe defaults
        setUserRole('student');
        setNeedsPasswordChange(false);
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
