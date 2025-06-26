
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 4000; // Reduced from 7000ms

interface SessionValidationResult {
  isValid: boolean;
  session: Session | null;
  user: User | null;
  needsRefresh: boolean;
  error?: string;
}

export const createSessionValidationService = () => {
  const recoveryService = createSessionRecoveryService();

  const validateSession = async (currentSession?: Session | null): Promise<SessionValidationResult> => {
    try {
      console.log('🔍 Enhanced session validation starting...', { 
        hasCurrentSession: !!currentSession,
        timestamp: new Date().toISOString()
      });
      
      // If we have a current session, validate it first
      if (currentSession) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = currentSession.expires_at;
        const bufferTime = 3 * 60; // Reduced buffer to 3 minutes
        
        // Check if session is expired
        if (expiresAt && now >= expiresAt) {
          console.log('⏰ Session expired');
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
        
        console.log('✅ Session validation successful (local check)');
        return {
          isValid: true,
          session: currentSession,
          user: currentSession.user,
          needsRefresh: false
        };
      }
      
      // No current session, get fresh session with retry mechanism
      const freshSessionData = await recoveryService.withRetry(async () => {
        const { data, error } = await withTimeout(
          supabase.auth.getSession(),
          OPTIMIZED_TIMEOUT,
          "[SessionValidationService] Timeout fetching session"
        );
        
        if (error) throw error;
        return data;
      });
      
      const freshSession = freshSessionData?.session;

      if (!freshSession) {
        console.log('ℹ️ No session found during validation');
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false
        };
      }
      
      // Validate the fresh session recursively
      return await validateSession(freshSession);
      
    } catch (error) {
      console.error('💥 Session validation failed:', error);
      
      // Handle authentication failures
      if (error?.status === 403 || error?.message?.includes('Authentication required')) {
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: 'Authentication required'
        };
      }
      
      return {
        isValid: false,
        session: null,
        user: null,
        needsRefresh: false,
        error: error?.message || 'Session validation failed'
      };
    }
  };

  const refreshSession = async (): Promise<SessionValidationResult> => {
    try {
      console.log('🔄 Enhanced session refresh starting...');
      
      const refreshedSessionData = await recoveryService.withRetry(async () => {
        const { data, error } = await withTimeout(
          supabase.auth.refreshSession(),
          OPTIMIZED_TIMEOUT,
          "[SessionValidationService] Timeout refreshing session"
        );
        
        if (error) throw error;
        return data;
      });
      
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
      
      console.log('✅ Session refresh successful');
      return {
        isValid: true,
        session,
        user: session.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session refresh error:', error);
      
      // Handle authentication failures
      if (error?.status === 403 || error?.message?.includes('Authentication required')) {
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: 'Authentication required'
        };
      }
      
      return {
        isValid: false,
        session: null,
        user: null,
        needsRefresh: false,
        error: error?.message || 'Session refresh failed'
      };
    }
  };

  return {
    validateSession,
    refreshSession
  };
};
