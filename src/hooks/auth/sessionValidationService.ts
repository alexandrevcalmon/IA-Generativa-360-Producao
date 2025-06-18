
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
      
      // If we have a current session, validate it first before making API calls
      if (currentSession) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = currentSession.expires_at;
        const bufferTime = 5 * 60; // 5 minutes buffer
        
        // Check if session is expired
        if (expiresAt && now >= expiresAt) {
          console.log('⏰ Session expired', {
            now: new Date(now * 1000).toISOString(),
            expiresAt: new Date(expiresAt * 1000).toISOString()
          });
          
          return {
            isValid: false,
            session: currentSession,
            user: currentSession.user,
            needsRefresh: true
          };
        }
        
        // Check if session is about to expire
        if (expiresAt && now >= (expiresAt - bufferTime)) {
          console.log('⏰ Session expiring soon, needs refresh');
          return {
            isValid: false,
            session: currentSession,
            user: currentSession.user,
            needsRefresh: true
          };
        }
        
        // Verify token integrity
        if (!currentSession.access_token || !currentSession.refresh_token) {
          console.warn('⚠️ Session missing critical tokens');
          return {
            isValid: false,
            session: currentSession,
            user: currentSession.user,
            needsRefresh: true
          };
        }
        
        // Session appears valid
        console.log('✅ Session validation successful (local check)', { 
          userId: currentSession.user?.id,
          timeLeft: `${Math.floor((expiresAt! - now) / 60)} minutes`
        });
        
        return {
          isValid: true,
          session: currentSession,
          user: currentSession.user,
          needsRefresh: false
        };
      }
      
      // No current session provided, get fresh session from Supabase
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
      
      // Validate the fresh session
      return await validateSession(freshSession);
      
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
        key.includes('auth-token') ||
        key.startsWith('supabase_auth_')
      );
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed: ${key}`);
      });
      
      // Clear session storage
      const sessionKeys = Object.keys(sessionStorage).filter(key =>
        key.includes('supabase') || key.includes('auth')
      );
      
      sessionKeys.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Removed from session: ${key}`);
      });
      
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
