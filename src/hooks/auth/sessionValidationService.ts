
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
      console.log('🔍 Validating session with enhanced error handling...', { 
        hasCurrentSession: !!currentSession,
        sessionId: currentSession?.access_token?.substring(0, 10) + '...' || 'none',
        timestamp: new Date().toISOString()
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
            expiresAt: new Date(expiresAt * 1000).toISOString(),
            timeDiff: now - expiresAt
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
          console.log('⏰ Session expiring soon, needs refresh', {
            timeLeft: `${Math.floor((expiresAt - now) / 60)} minutes`
          });
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
        console.error('❌ Session validation error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          timestamp: new Date().toISOString()
        });
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
      console.error('💥 Session validation failed:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
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
      console.log('🔄 Attempting session refresh with enhanced monitoring...');
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh failed:', {
          message: error.message,
          status: error.status,
          code: error.code,
          timestamp: new Date().toISOString()
        });
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
        newExpiresAt: new Date(session.expires_at! * 1000).toISOString(),
        timestamp: new Date().toISOString()
      });
      
      return {
        isValid: true,
        session,
        user: session.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session refresh error:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
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
    console.log('🧹 Starting enhanced local session cleanup...');
    
    try {
      // Clear specific auth-related localStorage items with enhanced logging
      const authKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.token') || 
        key.includes('supabase-auth-token') ||
        key.includes('auth-token') ||
        key.startsWith('supabase_auth_') ||
        key.includes('sb-') // Additional Supabase keys
      );
      
      console.log(`🔍 Found ${authKeys.length} auth-related localStorage keys to clear:`, authKeys);
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed localStorage: ${key}`);
      });
      
      // Clear session storage with enhanced logging
      const sessionKeys = Object.keys(sessionStorage).filter(key =>
        key.includes('supabase') || key.includes('auth') || key.includes('sb-')
      );
      
      console.log(`🔍 Found ${sessionKeys.length} auth-related sessionStorage keys to clear:`, sessionKeys);
      
      sessionKeys.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Removed sessionStorage: ${key}`);
      });
      
      // Force clear any remaining Supabase-related data
      try {
        // Clear all keys that might contain auth data
        const allLocalKeys = Object.keys(localStorage);
        const suspiciousKeys = allLocalKeys.filter(key => 
          key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('session') ||
          key.toLowerCase().includes('user') ||
          key.startsWith('supabase')
        );
        
        if (suspiciousKeys.length > 0) {
          console.log(`🔍 Additional cleanup - found ${suspiciousKeys.length} suspicious keys:`, suspiciousKeys);
          suspiciousKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️ Deep cleanup removed: ${key}`);
          });
        }
      } catch (deepCleanError) {
        console.log('ℹ️ Deep cleanup skipped:', deepCleanError.message);
      }
      
      console.log('✅ Enhanced local session data cleared successfully');
    } catch (error) {
      console.error('❌ Error during enhanced local session cleanup:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    validateSession,
    refreshSession,
    clearLocalSession
  };
};
