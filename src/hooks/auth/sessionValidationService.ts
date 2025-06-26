
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { withTimeout, TimeoutError } from '@/lib/utils';

const DEFAULT_TIMEOUT = 7000; // 7 seconds

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
      let freshSessionData: { session: Session | null } | null = null;
      let getSessionError: any = null;

      try {
        const { data, error } = await withTimeout(
          supabase.auth.getSession(),
          DEFAULT_TIMEOUT,
          "[SessionValidationService] Timeout fetching session"
        );
        if (error) getSessionError = error;
        freshSessionData = data;
      } catch (timeoutOrOtherError) {
        getSessionError = timeoutOrOtherError;
      }
      
      if (getSessionError) {
        console.error('❌ Session validation error (getSession):', {
          message: getSessionError.message,
          status: getSessionError.status,
          code: getSessionError.code,
          isTimeout: getSessionError instanceof TimeoutError,
          timestamp: new Date().toISOString()
        });
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: getSessionError.message
        };
      }
      
      const freshSession = freshSessionData?.session;

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
      
      let refreshedSessionData: { session: Session | null } | null = null;
      let refreshSessionError: any = null;

      try {
        const { data, error } = await withTimeout(
          supabase.auth.refreshSession(),
          DEFAULT_TIMEOUT,
          "[SessionValidationService] Timeout refreshing session"
        );
        if (error) refreshSessionError = error;
        refreshedSessionData = data;
      } catch (timeoutOrOtherError) {
        refreshSessionError = timeoutOrOtherError;
      }
      
      if (refreshSessionError) {
        console.error('❌ Session refresh failed:', {
          message: refreshSessionError.message,
          status: refreshSessionError.status,
          code: refreshSessionError.code,
          isTimeout: refreshSessionError instanceof TimeoutError,
          timestamp: new Date().toISOString()
        });
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: refreshSessionError.message
        };
      }
      
      const session = refreshedSessionData?.session;

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

  return {
    validateSession,
    refreshSession
  };
};
