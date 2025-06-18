
import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole, type UserRoleInfo } from './userRoleService';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [userRoleInfo, setUserRoleInfo] = useState<UserRoleInfo | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [companyUserData, setCompanyUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const clearUserState = () => {
    setUser(null);
    setSession(null);
    setUserRole('student');
    setUserRoleInfo(null);
    setNeedsPasswordChange(false);
    setCompanyUserData(null);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setUser(session?.user ?? null);
      setSession(session);
      
      if (session?.user) {
        getUserRole(session.user.id).then((roleInfo) => {
          console.log('Role info loaded:', roleInfo);
          setUserRole(roleInfo.role);
          setUserRoleInfo(roleInfo);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      setUser(session?.user ?? null);
      setSession(session);
      
      if (session?.user) {
        const roleInfo = await getUserRole(session.user.id);
        console.log('Role info updated:', roleInfo);
        setUserRole(roleInfo.role);
        setUserRoleInfo(roleInfo);
      } else {
        setUserRole('student');
        setUserRoleInfo(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    userRole,
    userRoleInfo,
    needsPasswordChange,
    companyUserData,
    loading,
    isInitialized,
    setUser,
    setSession,
    setUserRole,
    setUserRoleInfo,
    setNeedsPasswordChange,
    setCompanyUserData,
    setLoading,
    setIsInitialized,
    clearUserState,
  };
}
