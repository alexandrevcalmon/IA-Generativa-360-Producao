
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
        
        // If it's a refresh token error, clear corrupted data
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('Invalid Refresh Token')) {
          console.log('🧹 Clearing corrupted session data...');
          try {
            await supabase.auth.signOut({ scope: 'local' });
          } catch (signOutError) {
            console.warn('Warning clearing session:', signOutError);
          }
        }
        
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
      
      // For fresh sessions, do a simple validity check without recursion
      const now = Math.floor(Date.now() / 1000);
      const isExpired = freshSession.expires_at && now >= freshSession.expires_at;
      const hasTokens = !!freshSession.access_token && !!freshSession.refresh_token;
      
      if (isExpired || !hasTokens) {
        console.log('🚫 Fresh session is invalid', { isExpired, hasTokens });
        return {
          isValid: false,
          session: freshSession,
          user: freshSession.user,
          needsRefresh: !hasTokens ? false : true
        };
      }
      
      console.log('✅ Fresh session is valid');
      return {
        isValid: true,
        session: freshSession,
        user: freshSession.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session validation failed:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Clear potentially corrupted session data
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (signOutError) {
        console.warn('Warning clearing session after error:', signOutError);
      }
      
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
        
        // Handle corrupted refresh token errors
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('Invalid Refresh Token') ||
            error.message?.includes('refresh token not found')) {
          console.log('🧹 Corrupted refresh token detected, clearing local data...');
          try {
            await supabase.auth.signOut({ scope: 'local' });
          } catch (signOutError) {
            console.warn('Warning during cleanup signout:', signOutError);
          }
        }
        
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
      
      // Clear potentially corrupted data on critical errors
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (signOutError) {
        console.warn('Warning clearing session after refresh error:', signOutError);
      }
      
      return {
        isValid: false,
        session: null,
        user: null,
        needsRefresh: false,
        error: 'Session refresh failed'
      };
    }
  };

  return {
    validateSession,
    refreshSession
  };
};
