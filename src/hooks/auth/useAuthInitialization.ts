
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserRole } from './userRoleService';
import { useAuthState } from './useAuthState';
import { createSessionValidationService } from './sessionValidationService';

export function useAuthInitialization() {
  const authState = useAuthState();
  const sessionService = createSessionValidationService();
  
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
    console.log('🔐 Enhanced auth state changed:', { 
      event, 
      userEmail: session?.user?.email, 
      hasSession: !!session,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
    });
    
    if (event === 'SIGNED_OUT' || !session?.user) {
      console.log('🚪 User signed out, clearing state');
      clearUserState();
      setLoading(false);
      setIsInitialized(true);
      return;
    }
    
    // Validate the session before proceeding
    const validation = await sessionService.validateSession(session);
    
    if (!validation.isValid) {
      if (validation.needsRefresh) {
        console.log('🔄 Session needs refresh, attempting...');
        const refreshResult = await sessionService.refreshSession();
        
        if (refreshResult.isValid && refreshResult.session) {
          console.log('✅ Session refreshed successfully');
          session = refreshResult.session;
        } else {
          console.log('❌ Session refresh failed, clearing state');
          clearUserState();
          setLoading(false);
          setIsInitialized(true);
          return;
        }
      } else {
        console.log('❌ Invalid session, clearing state');
        clearUserState();
        setLoading(false);
        setIsInitialized(true);
        return;
      }
    }
    
    // Update session and user immediately
    setSession(session);
    setUser(session.user);
    
    // Fetch role data in a separate microtask to avoid recursion
    setTimeout(async () => {
      try {
        console.log('👤 Fetching user role and data...');
        const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(session.user.id);
        
        setUserRole(role);
        setNeedsPasswordChange(needsChange);
        setCompanyUserData(userData);
        
        console.log('✅ User data loaded:', { 
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
    console.log('🚀 Initializing Enhanced AuthProvider...');
    let isMounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Then check for existing session with validation
    const initializeAuth = async () => {
      try {
        console.log('🔍 Validating existing session...');
        const validation = await sessionService.validateSession();
        
        if (!validation.isValid && validation.needsRefresh) {
          console.log('🔄 Session expired, attempting refresh...');
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
          console.log('ℹ️ No valid session found');
          if (isMounted) {
            setLoading(false);
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up periodic session monitoring
    const sessionMonitor = setInterval(async () => {
      if (!isMounted) return;
      
      const validation = await sessionService.validateSession();
      if (!validation.isValid && validation.needsRefresh) {
        console.log('🔄 Session expired during monitoring, attempting refresh...');
        const refreshResult = await sessionService.refreshSession();
        
        if (!refreshResult.isValid) {
          console.log('❌ Session refresh failed during monitoring, signing out...');
          clearUserState();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearInterval(sessionMonitor);
    };
  }, []);

  return authState;
}
