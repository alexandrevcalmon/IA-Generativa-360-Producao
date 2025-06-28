
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 8000; // Increased from 4000ms
const SESSION_CACHE_DURATION = 60000; // 1 minute cache

interface SessionValidationResult {
  isValid: boolean;
  session: Session | null;
  user: User | null;
  needsRefresh: boolean;
  error?: string;
}

// Simple session cache to avoid repeated validation calls
let sessionCache: { session: Session | null; timestamp: number; isValid: boolean } | null = null;

export const createSessionValidationService = () => {
  const recoveryService = createSessionRecoveryService();

  const validateSession = async (currentSession?: Session | null): Promise<SessionValidationResult> => {
    try {
      console.log('🔍 Enhanced session validation starting...', { 
        hasCurrentSession: !!currentSession,
        timestamp: new Date().toISOString()
      });

      // Check cache first to avoid duplicate validation
      if (sessionCache && (Date.now() - sessionCache.timestamp) < SESSION_CACHE_DURATION) {
        console.log('✅ Using cached session validation result');
        return {
          isValid: sessionCache.isValid,
          session: sessionCache.session,
          user: sessionCache.session?.user || null,
          needsRefresh: false
        };
      }
      
      // If we have a current session, validate it first
      if (currentSession) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = currentSession.expires_at;
        const bufferTime = 5 * 60; // Increased buffer to 5 minutes
        
        // Check if session is expired
        if (expiresAt && now >= expiresAt) {
          console.log('⏰ Session expired');
          sessionCache = { session: currentSession, timestamp: Date.now(), isValid: false };
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
          sessionCache = { session: currentSession, timestamp: Date.now(), isValid: false };
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
          sessionCache = { session: currentSession, timestamp: Date.now(), isValid: false };
          return {
            isValid: false,
            session: currentSession,
            user: currentSession.user,
            needsRefresh: true
          };
        }
        
        console.log('✅ Session validation successful (local check)');
        sessionCache = { session: currentSession, timestamp: Date.now(), isValid: true };
        return {
          isValid: true,
          session: currentSession,
          user: currentSession.user,
          needsRefresh: false
        };
      }
      
      // No current session, get fresh session with reduced retry
      const freshSessionData = await recoveryService.withRetry(async () => {
        const { data, error } = await withTimeout(
          supabase.auth.getSession(),
          OPTIMIZED_TIMEOUT,
          "[SessionValidationService] Timeout fetching session"
        );
        
        if (error) throw error;
        return data;
      }, 1); // Reduced to single retry to avoid loops
      
      const freshSession = freshSessionData?.session;

      if (!freshSession) {
        console.log('ℹ️ No session found during validation');
        sessionCache = { session: null, timestamp: Date.now(), isValid: false };
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false
        };
      }
      
      // Validate the fresh session recursively (but only once to avoid loops)
      const recursiveResult = await validateSession(freshSession);
      sessionCache = { session: freshSession, timestamp: Date.now(), isValid: recursiveResult.isValid };
      return recursiveResult;
      
    } catch (error) {
      console.error('💥 Session validation failed:', error);
      
      // Clear cache on error
      sessionCache = null;
      
      // Handle authentication failures
      if (error?.status === 403 || error?.message?.includes('Authentication required') || error?.message?.includes('Access denied')) {
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
      
      // Clear cache before refresh
      sessionCache = null;
      
      const refreshedSessionData = await recoveryService.withRetry(async () => {
        const { data, error } = await withTimeout(
          supabase.auth.refreshSession(),
          OPTIMIZED_TIMEOUT,
          "[SessionValidationService] Timeout refreshing session"
        );
        
        if (error) throw error;
        return data;
      }, 1); // Single retry for refresh
      
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
      sessionCache = { session, timestamp: Date.now(), isValid: true };
      return {
        isValid: true,
        session,
        user: session.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session refresh error:', error);
      
      // Handle authentication failures
      if (error?.status === 403 || error?.message?.includes('Authentication required') || error?.message?.includes('Access denied')) {
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
