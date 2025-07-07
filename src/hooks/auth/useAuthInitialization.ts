import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createAuthStateManager, AuthState } from './authStateManager';

export function useAuthInitialization() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    userRole: null,
    needsPasswordChange: false,
    companyUserData: null,
    loading: true,
    isInitialized: false,
  });

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);

  const authStateManager = createAuthStateManager(authState, updateAuthState);

  // Check if we're in a password reset flow
  const isPasswordResetFlow = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasResetTokens = urlParams.get('access_token') && urlParams.get('refresh_token') && urlParams.get('type') === 'recovery';
    const hasResetFlag = urlParams.get('reset') === 'true';
    return hasResetTokens || hasResetFlag;
  };

  useEffect(() => {
    console.log('🔧 AuthProvider: Starting initialization...');
    
    // Skip auth initialization if we're in a password reset flow
    if (isPasswordResetFlow()) {
      console.log('🔐 Password reset flow detected, skipping auth initialization');
      updateAuthState({ loading: false, isInitialized: true });
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔧 AuthProvider: Setting up auth state listener...');
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔔 Auth state change:', { event, user: session?.user?.email });
            
            if (!mounted) return;

            // Skip processing if we're in a password reset flow
            if (isPasswordResetFlow()) {
              console.log('🔐 Skipping auth state change during password reset flow');
              return;
            }

            updateAuthState({ session, user: session?.user ?? null });

            if (session?.user && event !== 'SIGNED_OUT') {
              // Refresh user data asynchronously
              setTimeout(async () => {
                if (!mounted) return;
                try {
                  await authStateManager.refreshUserData(session.user);
                } catch (error) {
                  console.error('⚠️ Error refreshing user data:', error);
                }
              }, 0);
            } else {
              // Clear state on sign out
              authStateManager.clearState();
            }
          }
        );

        // Get initial session
        console.log('🔧 AuthProvider: Getting initial session...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
        }

        if (mounted && initialSession?.user) {
          console.log('✅ Initial session found:', initialSession.user.email);
          updateAuthState({ 
            session: initialSession, 
            user: initialSession.user 
          });

          // Load user auxiliary data
          try {
            await authStateManager.refreshUserData(initialSession.user);
          } catch (error) {
            console.error('⚠️ Error loading initial user auxiliary data:', error);
            if (mounted) {
              updateAuthState({
                userRole: initialSession.user.user_metadata?.role || 'student',
                needsPasswordChange: false,
                companyUserData: null,
              });
            }
          }
        } else {
          console.log('ℹ️ No initial session found');
        }

        if (mounted) {
          updateAuthState({ loading: false, isInitialized: true });
        }

        // Cleanup function
        return () => {
          console.log('🔧 AuthProvider: Cleaning up auth listener');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) {
          updateAuthState({ loading: false, isInitialized: true });
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [authStateManager, updateAuthState]);

  const refreshUserRole = useCallback(async () => {
    if (authState.user) {
      await authStateManager.refreshUserData(authState.user);
    }
  }, [authState.user, authStateManager]);

  return {
    ...authState,
    refreshUserRole,
    // Legacy setters for compatibility
    setUser: (user: User | null) => updateAuthState({ user }),
    setSession: (session: Session | null) => updateAuthState({ session }),
    setUserRole: (userRole: string | null) => updateAuthState({ userRole }),
    setNeedsPasswordChange: (needsPasswordChange: boolean) => updateAuthState({ needsPasswordChange }),
    setCompanyUserData: (companyUserData: any) => updateAuthState({ companyUserData }),
    setLoading: (loading: boolean) => updateAuthState({ loading }),
  };
}