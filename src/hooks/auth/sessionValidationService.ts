
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface SessionValidationResult {
  isValid: boolean;
  session: Session | null;
  user: User | null;
  needsRefresh: boolean;
  error?: string;
}

export const createSessionValidationService = () => {
  const validateSession = async (currentSession?: Session | null): Promise<SessionValidationResult> => {
    try {
      console.log('🔍 Validating session...', { hasCurrentSession: !!currentSession });
      
      // Get fresh session from Supabase
      const { data: { session: freshSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session validation error:', error);
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: error.message
        };
      }
      
      // No session exists
      if (!freshSession) {
        console.log('ℹ️ No session found');
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false
        };
      }
      
      // Check if session is expired
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = freshSession.expires_at;
      
      if (expiresAt && now >= expiresAt) {
        console.log('⏰ Session expired, attempting refresh...');
        return {
          isValid: false,
          session: freshSession,
          user: freshSession.user,
          needsRefresh: true
        };
      }
      
      // Session is valid
      console.log('✅ Session is valid', { 
        userId: freshSession.user?.id, 
        expiresAt: new Date(expiresAt! * 1000).toISOString() 
      });
      
      return {
        isValid: true,
        session: freshSession,
        user: freshSession.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session validation failed:', error);
      return {
        isValid: false,
        session: null,
        user: null,
        needsRefresh: false,
        error: 'Session validation failed'
      };
    }
  };

  const refreshSession = async (): Promise<SessionValidationResult> => {
    try {
      console.log('🔄 Refreshing session...');
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh error:', error);
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: error.message
        };
      }
      
      if (!session) {
        console.log('ℹ️ No session after refresh');
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false
        };
      }
      
      console.log('✅ Session refreshed successfully');
      return {
        isValid: true,
        session,
        user: session.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session refresh failed:', error);
      return {
        isValid: false,
        session: null,
        user: null,
        needsRefresh: false,
        error: 'Session refresh failed'
      };
    }
  };

  const clearLocalSession = () => {
    console.log('🧹 Clearing local session data...');
    
    try {
      // Clear browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cached data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      console.log('✅ Local session data cleared');
    } catch (error) {
      console.error('❌ Error clearing local session:', error);
    }
  };

  return {
    validateSession,
    refreshSession,
    clearLocalSession
  };
};
