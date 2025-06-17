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
  const [sessionProtected, setSessionProtected] = useState(false);
  const [fetchingRole, setFetchingRole] = useState(false);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string): Promise<{ role: string | null; needsPasswordChange: boolean; companyUserData: any }> => {
    // Prevent multiple simultaneous requests
    if (fetchingRole) {
      console.log('Role fetch already in progress, skipping...');
      return { role: null, needsPasswordChange: false, companyUserData: null };
    }

    try {
      setFetchingRole(true);
      console.log('Fetching role for user:', userId);
      
      // First check if user is in profiles table (producer/company)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!profileError && profile?.role) {
        console.log('User role from profiles:', profile.role);
        return { role: profile.role, needsPasswordChange: false, companyUserData: null };
      }
      
      // If not found in profiles, check company_users table (student/collaborator)
      const { data: companyUser, error: companyUserError } = await supabase
        .from('company_users')
        .select('*, companies(name)')
        .eq('auth_user_id', userId)
        .single();
      
      if (!companyUserError && companyUser) {
        console.log('User found in company_users:', companyUser);
        const needsChange = companyUser.needs_password_change || false;
        console.log('needs_password_change flag:', needsChange);
        return { role: 'student', needsPasswordChange: needsChange, companyUserData: companyUser };
      }
      
      console.log('User role not found, defaulting to student');
      return { role: 'student', needsPasswordChange: false, companyUserData: null };
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return { role: 'student', needsPasswordChange: false, companyUserData: null }; // Safe fallback
    } finally {
      setFetchingRole(false);
    }
  };

  const refreshUserRole = async () => {
    if (user && !fetchingRole) {
      console.log('Refreshing user role...');
      const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(user.id);
      if (role) {
        setUserRole(role);
        setNeedsPasswordChange(needsChange);
        setCompanyUserData(userData);
        console.log('User role refreshed to:', role, 'needs password change:', needsChange);
      }
    }
  };

  // Protection against session interference during user creation
  const protectCurrentSession = () => {
    if (user && userRole === 'producer') {
      setSessionProtected(true);
      console.log('Session protection activated for producer:', user.email);
      
      // Auto-disable protection after 10 seconds
      setTimeout(() => {
        setSessionProtected(false);
        console.log('Session protection auto-disabled');
      }, 10000);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let debounceTimer: NodeJS.Timeout;

    // Set up auth state listener with session protection
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        // If session is protected and this is a user creation event, ignore it
        if (sessionProtected && event === 'SIGNED_IN' && session?.user) {
          console.log('Ignoring auth state change due to session protection');
          
          // Force logout the new user to prevent session takeover
          try {
            await supabase.auth.signOut();
            console.log('Forced logout of newly created user');
          } catch (error) {
            console.error('Error during forced logout:', error);
          }
          return;
        }

        // Check if this is an unwanted session change (user creation interfering with producer session)
        if (user && userRole === 'producer' && session?.user && session.user.id !== user.id) {
          console.warn('Detected session interference - restoring producer session');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only fetch role data if this is NOT from a manual sign-in (to avoid conflicts)
        if (session?.user && isMounted && event !== 'SIGNED_IN') {
          // Clear any existing timer
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
          
          // Set a new timer to fetch role after a short delay
          debounceTimer = setTimeout(async () => {
            if (isMounted && !fetchingRole) {
              const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(session.user.id);
              if (isMounted && role) {
                setUserRole(role);
                setNeedsPasswordChange(needsChange);
                setCompanyUserData(userData);
                console.log('User role set to:', role, 'needs password change:', needsChange);
              }
            }
          }, 300); // 300ms debounce
        } else if (isMounted && !session?.user) {
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
          
          // Use debounce for initial role fetch too
          debounceTimer = setTimeout(async () => {
            if (isMounted && !fetchingRole) {
              const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(session.user.id);
              if (isMounted && role) {
                setUserRole(role);
                setNeedsPasswordChange(needsChange);
                setCompanyUserData(userData);
                console.log('Initial user role set to:', role, 'needs password change:', needsChange);
              }
            }
          }, 300);
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
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to prevent re-running

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
        console.log('Sign in successful, fetching user data immediately');
        
        // Fetch user role and password change status IMMEDIATELY after successful login
        const { role, needsPasswordChange: needsChange, companyUserData: userData } = await fetchUserRole(data.user.id);
        
        console.log('Post-login user data:', { role, needsChange, userData });
        
        // Update state immediately
        setUser(data.user);
        setSession(data.session);
        setUserRole(role);
        setNeedsPasswordChange(needsChange);
        setCompanyUserData(userData);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        
        // Return the password change status so Auth page can use it immediately
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
        setSessionProtected(false);
        setFetchingRole(false);
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
