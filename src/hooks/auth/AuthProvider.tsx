
import { useState, useEffect, createContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from './types';
import { fetchUserRole } from './userRoleService';
import { createAuthService } from './authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [companyUserData, setCompanyUserData] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const authService = createAuthService(toast);

  const clearUserState = () => {
    console.log('🧹 Clearing all user state...');
    setUser(null);
    setSession(null);
    setUserRole(null);
    setNeedsPasswordChange(false);
    setCompanyUserData(null);
  };

  const refreshUserRole = async () => {
    if (!user) {
      console.log('⚠️ No user available for role refresh');
      return;
    }
    
    console.log('🔄 Refreshing user role for:', user.email);
    try {
      const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(user.id);
      setUserRole(role);
      setNeedsPasswordChange(needsChange);
      setCompanyUserData(userData);
      console.log('✅ User role refreshed:', { role, needsChange, hasUserData: !!userData });
    } catch (error) {
      console.error('❌ Error refreshing user role:', error);
      // Set default role on error
      setUserRole('student');
      setNeedsPasswordChange(false);
      setCompanyUserData(null);
    }
  };

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

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting sign in for:', email);
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password);
      
      if (result.user && !result.error) {
        console.log('✅ Sign in successful, fetching user data...');
        
        // Fetch user role immediately after successful login
        const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(result.user.id);
        
        setUser(result.user);
        setSession(result.session);
        setUserRole(role);
        setNeedsPasswordChange(needsChange);
        setCompanyUserData(userData);
        
        console.log('✅ Sign in complete:', { role, needsChange, hasUserData: !!userData });
        
        setLoading(false);
        return { error: null, needsPasswordChange: needsChange };
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
    const result = await authService.changePassword(newPassword, user?.id, companyUserData);
    
    if (!result.error && companyUserData) {
      setNeedsPasswordChange(false);
      console.log('✅ Password changed, needs_password_change set to false');
    }
    
    return result;
  };

  const signOut = async () => {
    console.log('🚪 AuthProvider signOut called');
    
    try {
      const result = await authService.signOut();
      
      if (!result.error) {
        console.log('✅ SignOut successful');
        // Auth state change will handle clearing state
      } else {
        console.error('❌ SignOut error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('💥 SignOut error:', error);
      return { error };
    }
  };

  // Role helper properties
  const isProducer = userRole === 'producer';
  const isCompany = userRole === 'company';
  const isStudent = userRole === 'student';

  const value = {
    user,
    session,
    loading: loading || !isInitialized,
    signIn,
    signUp: authService.signUp,
    signOut,
    changePassword,
    userRole,
    isProducer,
    isCompany,
    isStudent,
    needsPasswordChange,
    companyUserData,
    refreshUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
