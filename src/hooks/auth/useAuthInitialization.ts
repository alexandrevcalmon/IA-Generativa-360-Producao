
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserRoleAuxiliaryData } from './userRoleService';

export function useAuthInitialization() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [companyUserData, setCompanyUserData] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if we're in a password reset flow
  const isPasswordResetFlow = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
    const type = searchParams.get('type') || hashParams.get('type');

    const hasResetTokens = !!accessToken && !!refreshToken && type === 'recovery';
    const hasResetFlag = searchParams.get('reset') === 'true' || hashParams.get('reset') === 'true';
    return hasResetTokens || hasResetFlag;
  };

  useEffect(() => {
    console.log('🔧 AuthProvider: Starting initialization...');
    
    // Skip auth initialization if we're in a password reset flow
    if (isPasswordResetFlow()) {
      console.log('🔐 Password reset flow detected, skipping auth initialization');
      setLoading(false);
      setIsInitialized(true);
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

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user && event !== 'SIGNED_OUT') {
              // Fetch user role data asynchronously
              setTimeout(async () => {
                if (!mounted) return;
                
                try {
                  const auxData = await fetchUserRoleAuxiliaryData(session.user);
                  const finalRole = auxData.role || 'student';
                  
                  if (!mounted) return;
                  
                  setUserRole(finalRole);
                  setNeedsPasswordChange(auxData.needsPasswordChange || false);

                  // Set company data based on role
                  if (finalRole === 'company') {
                    setCompanyUserData(auxData.companyData);
                  } else if (finalRole === 'collaborator') {
                    setCompanyUserData(auxData.collaboratorData);
                  } else {
                    setCompanyUserData(null);
                  }
                } catch (error) {
                  console.error('⚠️ Error loading user auxiliary data:', error);
                  if (!mounted) return;
                  setUserRole(session.user.user_metadata?.role || 'student');
                  setNeedsPasswordChange(false);
                  setCompanyUserData(null);
                }
              }, 0);
            } else {
              // Clear state on sign out
              setUserRole(null);
              setNeedsPasswordChange(false);
              setCompanyUserData(null);
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
          setSession(initialSession);
          setUser(initialSession.user);

          // Load user auxiliary data
          try {
            const auxData = await fetchUserRoleAuxiliaryData(initialSession.user);
            const finalRole = auxData.role || 'student';
            
            if (mounted) {
              setUserRole(finalRole);
              setNeedsPasswordChange(auxData.needsPasswordChange || false);

              // Set company data based on role
              if (finalRole === 'company') {
                setCompanyUserData(auxData.companyData);
              } else if (finalRole === 'collaborator') {
                setCompanyUserData(auxData.collaboratorData);
              } else {
                setCompanyUserData(null);
              }
            }
          } catch (error) {
            console.error('⚠️ Error loading initial user auxiliary data:', error);
            if (mounted) {
              setUserRole(initialSession.user.user_metadata?.role || 'student');
              setNeedsPasswordChange(false);
              setCompanyUserData(null);
            }
          }
        } else {
          console.log('ℹ️ No initial session found');
        }

        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }

        // Cleanup function
        return () => {
          console.log('🔧 AuthProvider: Cleaning up auth listener');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  return {
    user,
    session,
    loading,
    userRole,
    needsPasswordChange,
    companyUserData,
    isInitialized,
    setUser,
    setSession,
    setUserRole,
    setNeedsPasswordChange,
    setCompanyUserData,
    setLoading,
  };
}
