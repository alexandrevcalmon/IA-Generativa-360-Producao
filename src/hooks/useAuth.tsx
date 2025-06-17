
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  changePassword: (newPassword: string) => Promise<{ error: any }>;
  userRole: string | null;
  isProducer: boolean;
  isCompany: boolean;
  isStudent: boolean;
  needsPasswordChange: boolean;
  companyUserData: any;
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

  const fetchUserRole = async (userId: string): Promise<string | null> => {
    try {
      console.log('Fetching role for user:', userId);
      
      // First check if user is in profiles table (producer/company)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!profileError && profile?.role) {
        console.log('User role from profiles:', profile.role);
        return profile.role;
      }
      
      // If not found in profiles, check company_users table (student/collaborator)
      const { data: companyUser, error: companyUserError } = await supabase
        .from('company_users')
        .select('*, companies(name)')
        .eq('auth_user_id', userId)
        .single();
      
      if (!companyUserError && companyUser) {
        console.log('User found in company_users:', companyUser);
        setCompanyUserData(companyUser);
        setNeedsPasswordChange(companyUser.needs_password_change || false);
        return 'student';
      }
      
      console.log('User role not found, defaulting to student');
      return 'student';
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && isMounted) {
          // Fetch user role and additional data
          const role = await fetchUserRole(session.user.id);
          if (isMounted) {
            setUserRole(role);
            console.log('User role set to:', role);
          }
        } else if (isMounted) {
          setUserRole(null);
          setNeedsPasswordChange(false);
          setCompanyUserData(null);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session immediately
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted && session?.user) {
          console.log('Found existing session for user:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          const role = await fetchUserRole(session.user.id);
          if (isMounted) {
            setUserRole(role);
            console.log('Initial user role set to:', role);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('SignIn error:', error);
      return { error };
    } finally {
      // Don't set loading to false here, let the auth state change handle it
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
        // Update the needs_password_change flag
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
