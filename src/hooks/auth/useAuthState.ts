
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole, type UserRoleInfo } from './userRoleService';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [userRoleInfo, setUserRoleInfo] = useState<UserRoleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setUser(session?.user ?? null);
      
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
    userRole,
    userRoleInfo,
    loading,
  };
}
