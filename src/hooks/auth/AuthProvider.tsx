import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('student');
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [companyUserData, setCompanyUserData] = useState(null);
  const [isProducer, setIsProducer] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setUserRole('student');
      setNeedsPasswordChange(false);
      setCompanyUserData(null);
      setIsProducer(false);
    }
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  const changePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  };

  const refreshUserRole = async () => {
    // Simple implementation - can be enhanced later
    console.log('Refreshing user role...');
  };

  const signUp = async (email: string, password: string, role?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const value: AuthContextType = {
    user,
    session: null,
    loading,
    userRole,
    needsPasswordChange,
    companyUserData,
    isProducer,
    isCompany: userRole === 'company',
    isStudent: userRole === 'student',
    isSubscriptionBlocked: false,
    signIn: async (email: string, password: string, role?: string) => {
      const { data, error } = await signIn(email, password);
      return { error, needsPasswordChange };
    },
    signUp,
    signOut,
    resetPassword,
    changePassword,
    refreshUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}