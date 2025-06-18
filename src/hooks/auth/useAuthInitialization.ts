
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserRole } from './userRoleService';
import { useAuthState } from './useAuthState';

export function useAuthInitialization() {
  const authState = useAuthState();
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
    console.log('🔐 Auth state changed:', { event, userEmail: session?.user?.email, hasSession: !!session });
    
    if (event === 'SIGNED_OUT' || !session?.user) {
      console.log('🚪 User signed out, clearing state');
      clearUserState();
      setLoading(false);
      setIsInitialized(true);
      return;
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
    console.log('🚀 Initializing AuthProvider...');
    let isMounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (isMounted) {
            setLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        if (session?.user && isMounted) {
          console.log('✅ Found existing session for:', session.user.email);
          await handleAuthStateChange('SIGNED_IN', session);
        } else {
          console.log('ℹ️ No existing session found');
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

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
}
