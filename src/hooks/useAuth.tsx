import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; needsPasswordChange?: boolean }>;
  signUp: (email: string, password: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  changePassword: (newPassword: string) => Promise<{ error: any }>;
  userRole: string | null;
  isProducer: boolean;
  isCompany: boolean;
  isStudent: boolean;
  needsPasswordChange: boolean;
  companyUserData: any;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [companyUserData, setCompanyUserData] = useState<any>(null);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string): Promise<{ role: string | null; needsPasswordChange: boolean; companyUserData: any }> => {
    try {
      console.group('🔍 Fetching user role and data');
      console.log('User ID:', userId);
      
      // First check profiles table (producer/company)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile query result:', { profile, profileError });
      
      if (!profileError && profile?.role) {
        console.log('✅ User role from profiles:', profile.role);
        console.groupEnd();
        return { role: profile.role, needsPasswordChange: false, companyUserData: null };
      }
      
      // Check company_users table (student/collaborator) with detailed logging
      console.log('🔍 Checking company_users table...');
      const { data: companyUser, error: companyUserError } = await supabase
        .from('company_users')
        .select(`
          *,
          companies(
            id,
            name,
            official_name
          )
        `)
        .eq('auth_user_id', userId)
        .maybeSingle();
      
      console.log('Company user query result:', {
        companyUser,
        companyUserError,
        hasData: !!companyUser,
        companyUserFields: companyUser ? Object.keys(companyUser) : 'no data'
      });
      
      if (!companyUserError && companyUser) {
        console.log('✅ User found in company_users:');
        console.log('- Name:', companyUser.name);
        console.log('- Email:', companyUser.email);
        console.log('- Position:', companyUser.position);
        console.log('- Phone:', companyUser.phone);
        console.log('- Company:', companyUser.companies?.name);
        console.log('- Is Active:', companyUser.is_active);
        console.log('- Needs Password Change:', companyUser.needs_password_change);
        
        const needsChange = companyUser.needs_password_change || false;
        console.log('🔐 Password change required:', needsChange);
        console.groupEnd();
        return { role: 'student', needsPasswordChange: needsChange, companyUserData: companyUser };
      }
      
      if (companyUserError) {
        console.error('❌ Error fetching company user data:', companyUserError);
      } else {
        console.log('ℹ️ No company user data found for user');
      }
      
      console.log('🎓 Defaulting to student role without company data');
      console.groupEnd();
      return { role: 'student', needsPasswordChange: false, companyUserData: null };
    } catch (error) {
      console.error('💥 Error in fetchUserRole:', error);
      console.groupEnd();
      return { role: 'student', needsPasswordChange: false, companyUserData: null };
    }
  };

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
    try {
      setLoading(true);
      console.log('Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        console.log('Sign in successful, fetching user data');
        
        const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(data.user.id);
        
        setUser(data.user);
        setSession(data.session);
        setUserRole(role);
        setNeedsPasswordChange(needsChange);
        setCompanyUserData(userData);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        
        return { error: null, needsPasswordChange: needsChange };
      }
      
      return { error };
    } catch (error) {
      console.error('SignIn error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: string = 'student') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role
          }
        }
      });
      
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('SignUp error:', error);
      return { error };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (!error && companyUserData) {
        await supabase
          .from('company_users')
          .update({ needs_password_change: false })
          .eq('auth_user_id', user?.id);
        
        setNeedsPasswordChange(false);
        
        toast({
          title: "Senha alterada com sucesso!",
          description: "Sua nova senha foi definida.",
        });
      }

      return { error };
    } catch (error) {
      console.error('Change password error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUserRole(null);
        setNeedsPasswordChange(false);
        setCompanyUserData(null);
        toast({
          title: "Logout realizado com sucesso!",
          description: "Até mais!",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error };
    }
  };

  const isProducer = userRole === 'producer';
  const isCompany = userRole === 'company';
  const isStudent = userRole === 'student';

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
