
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
      console.log('🔍 Validating session...', { 
        hasCurrentSession: !!currentSession,
        sessionId: currentSession?.access_token?.substring(0, 10) + '...' || 'none'
      });
      
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
        console.log('ℹ️ No session found during validation');
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false
        };
      }
      
      // Check if session is expired or about to expire (5 min buffer)
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = freshSession.expires_at;
      const bufferTime = 5 * 60; // 5 minutes
      
      if (expiresAt && now >= (expiresAt - bufferTime)) {
        console.log('⏰ Session expired or expiring soon, needs refresh', {
          now: new Date(now * 1000).toISOString(),
          expiresAt: new Date(expiresAt * 1000).toISOString(),
          timeLeft: expiresAt - now
        });
        
        return {
          isValid: false,
          session: freshSession,
          user: freshSession.user,
          needsRefresh: true
        };
      }
      
      // Verify token integrity
      if (!freshSession.access_token || !freshSession.refresh_token) {
        console.warn('⚠️ Session missing critical tokens');
        return {
          isValid: false,
          session: freshSession,
          user: freshSession.user,
          needsRefresh: true
        };
      }
      
      // Session is valid
      console.log('✅ Session validation successful', { 
        userId: freshSession.user?.id, 
        expiresAt: new Date(expiresAt! * 1000).toISOString(),
        timeLeft: `${Math.floor((expiresAt! - now) / 60)} minutes`
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
      console.log('🔄 Attempting session refresh...');
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh failed:', error);
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: error.message
        };
      }
      
      if (!session) {
        console.log('ℹ️ No session returned after refresh attempt');
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false
        };
      }
      
      console.log('✅ Session refresh successful', {
        userId: session.user?.id,
        newExpiresAt: new Date(session.expires_at! * 1000).toISOString()
      });
      
      return {
        isValid: true,
        session,
        user: session.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session refresh error:', error);
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
      // Clear specific auth-related localStorage items
      const authKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.token') || 
        key.includes('supabase-auth-token') ||
        key.includes('auth-token')
      );
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed: ${key}`);
      });
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear any cached auth data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('auth') || name.includes('supabase')) {
              caches.delete(name);
            }
          });
        });
      }
      
      console.log('✅ Local session data cleared successfully');
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
