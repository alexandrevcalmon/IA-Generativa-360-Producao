
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { createAuthStateHandler } from './authStateHandler';
import { createAuthInitializer } from './authInitializer';
import { createSessionMonitor } from './sessionMonitor';
import { createCriticalErrorHandler } from './criticalErrorHandler';

export function useAuthInitialization() {
  const authState = useAuthState();
  const isMountedRef = useRef(true);
  
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

  const authStateHandler = createAuthStateHandler({
    setSession,
    setUser,
    setUserRole,
    setNeedsPasswordChange,
    setCompanyUserData,
    setLoading,
    setIsInitialized,
    clearUserState,
  });

  const authInitializer = createAuthInitializer({
    handleAuthStateChange: authStateHandler.handleAuthStateChange,
    setLoading,
    setIsInitialized,
    clearUserState,
  });

  const sessionMonitor = createSessionMonitor({
    clearUserState,
  });

  useEffect(() => {
    console.log('🚀 Initializing Enhanced AuthProvider with improved session management...');
    isMountedRef.current = true;
    let refreshTimer: NodeJS.Timeout | null = null;
    
    const errorHandler = createCriticalErrorHandler();

    // Set up auth state listener first with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMountedRef.current) return;
      
      try {
        await authStateHandler.handleAuthStateChange(event, session);
      } catch (error) {
        console.error('💥 Error in auth state change handler:', error);
        
        // Handle critical auth errors
        const wasHandled = await errorHandler.handleCriticalAuthError(error, () => {
          if (isMountedRef.current) {
            clearUserState();
            setLoading(false);
            setIsInitialized(true);
          }
        });
        
        if (!wasHandled) {
          // If not a critical error, just log and continue
          console.warn('Non-critical error in auth state handler:', error);
        }
      }
    });

    // Initialize auth state with error handling
    const initializeWithErrorHandling = async () => {
      try {
        await authInitializer.initializeAuth(isMountedRef);
      } catch (error) {
        console.error('💥 Error during auth initialization:', error);
        
        const wasHandled = await errorHandler.handleCriticalAuthError(error, () => {
          if (isMountedRef.current) {
            clearUserState();
            setLoading(false);
            setIsInitialized(true);
          }
        });
        
        if (!wasHandled && isMountedRef.current) {
          // Fallback for non-critical errors
          clearUserState();
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeWithErrorHandling();

    // Set up periodic session monitoring
    refreshTimer = sessionMonitor.setupSessionMonitoring(isMountedRef);

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, []);

  return authState;
}
