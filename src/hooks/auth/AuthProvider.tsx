
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
  const { toast } = useToast();

  const authService = createAuthService(toast);

  const refreshUserRole = async () => {
    if (user) {
      console.log('🔄 Refreshing user role for:', user.email);
      try {
        const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(user.id);
        setUserRole(role);
        setNeedsPasswordChange(needsChange);
        setCompanyUserData(userData);
        console.log('✅ User role refreshed:', { role, needsChange, hasUserData: !!userData });
      } catch (error) {
        console.error('❌ Error refreshing user role:', error);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('🔐 Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && isMounted) {
          console.log('👤 User authenticated, fetching role and data...');
          // Fetch user data when authenticated
          const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(session.user.id);
          if (isMounted) {
            setUserRole(role);
            setNeedsPasswordChange(needsChange);
            setCompanyUserData(userData);
            console.log('✅ User data set in auth context:', { role, needsChange, hasUserData: !!userData });
          }
        } else if (isMounted && !session?.user) {
          console.log('🚪 User logged out, clearing data');
          setUserRole(null);
          setNeedsPasswordChange(false);
          setCompanyUserData(null);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted && session?.user) {
          console.log('✅ Found existing session for user:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(session.user.id);
          if (isMounted) {
            setUserRole(role);
            setNeedsPasswordChange(needsChange);
            setCompanyUserData(userData);
            console.log('✅ Initial user data set:', { role, needsChange, hasUserData: !!userData });
          }
        } else {
          console.log('ℹ️ No existing session found');
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
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
    setLoading(true);
    const result = await authService.signIn(email, password);
    
    if (result.user && !result.error) {
      const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(result.user.id);
      
      setUser(result.user);
      setSession(result.session);
      setUserRole(role);
      setNeedsPasswordChange(needsChange);
      setCompanyUserData(userData);
      
      setLoading(false);
      return { error: null, needsPasswordChange: needsChange };
    }
    
    setLoading(false);
    return result;
  };

  const changePassword = async (newPassword: string) => {
    const result = await authService.changePassword(newPassword, user?.id, companyUserData);
    
    if (!result.error && companyUserData) {
      setNeedsPasswordChange(false);
    }
    
    return result;
  };

  const signOut = async () => {
    const result = await authService.signOut();
    
    if (!result.error) {
      setUserRole(null);
      setNeedsPasswordChange(false);
      setCompanyUserData(null);
    }
    
    return result;
  };

  const isProducer = userRole === 'producer';
  const isCompany = userRole === 'company';
  const isStudent = userRole === 'student';

  const value = {
    user,
    session,
    loading,
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
