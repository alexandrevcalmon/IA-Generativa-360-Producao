
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 3000; // Increased back to 3000ms for better reliability
const SESSION_CACHE_DURATION = 5 * 60 * 1000; // Reduced to 5 minutes to prevent stale data

interface SessionValidationResult {
  isValid: boolean;
  session: Session | null;
  user: User | null;
  needsRefresh: boolean;
  error?: string;
}

// Simplified session cache with better invalidation
let sessionCache: { session: Session | null; timestamp: number; userId: string | null } | null = null;

export const createSessionValidationService = () => {
  const recoveryService = createSessionRecoveryService();

  // Clear cache when user changes or on explicit request
  const clearCache = (userId?: string) => {
    if (!userId || !sessionCache || sessionCache.userId === userId) {
      sessionCache = null;
      console.log('🧹 Session cache cleared');
    }
  };

  const validateSession = async (currentSession?: Session | null): Promise<SessionValidationResult> => {
    try {
      console.log('🔍 Enhanced session validation starting...', { 
        hasCurrentSession: !!currentSession,
        timestamp: new Date().toISOString()
      });

      // If we have a current session, validate it first with local checks
      if (currentSession) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = currentSession.expires_at;
        const bufferTime = 5 * 60; // Reduced buffer to 5 minutes
        
        // Check if session is expired
        if (expiresAt && now >= expiresAt) {
          console.log('⏰ Session expired');
          clearCache(currentSession.user?.id);
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
          clearCache(currentSession.user?.id);
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
          clearCache(currentSession.user?.id);
          return {
            isValid: false,
            session: currentSession,
            user: currentSession.user,
            needsRefresh: true
          };
        }
        
        // Check cache validity for this specific user
        const userId = currentSession.user?.id;
        if (sessionCache && 
            sessionCache.userId === userId && 
            (Date.now() - sessionCache.timestamp) < SESSION_CACHE_DURATION) {
          console.log('✅ Using cached session validation result');
          return {
            isValid: true,
            session: currentSession,
            user: currentSession.user,
            needsRefresh: false
          };
        }
        
        console.log('✅ Session validation successful (local check)');
        // Update cache for this user
        sessionCache = { 
          session: currentSession, 
          timestamp: Date.now(), 
          userId: userId || null 
        };
        
        return {
          isValid: true,
          session: currentSession,
          user: currentSession.user,
          needsRefresh: false
        };
      }
      
      // No current session, try to get fresh session
      let freshSessionData;
      try {
        freshSessionData = await withTimeout(
          supabase.auth.getSession(),
          OPTIMIZED_TIMEOUT,
          "[SessionValidationService] Timeout fetching session"
        );
      } catch (timeoutError) {
        console.warn('⚠️ Session fetch timed out, assuming no session');
        clearCache();
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: 'Session fetch timeout'
        };
      }
      
      if (freshSessionData.error) {
        console.warn('⚠️ Session fetch error:', freshSessionData.error);
        clearCache();
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: freshSessionData.error.message
        };
      }
      
      const freshSession = freshSessionData?.data?.session;

      if (!freshSession) {
        console.log('ℹ️ No session found during validation');
        clearCache();
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false
        };
      }
      
      // Validate the fresh session
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = freshSession.expires_at;
      const isExpired = expiresAt && now >= expiresAt;
      const needsRefresh = !freshSession.access_token || !freshSession.refresh_token || isExpired;
      
      const isValid = !needsRefresh;
      
      // Update cache
      sessionCache = { 
        session: freshSession, 
        timestamp: Date.now(), 
        userId: freshSession.user?.id || null 
      };
      
      return {
        isValid,
        session: freshSession,
        user: freshSession.user,
        needsRefresh
      };
      
    } catch (error) {
      console.error('💥 Session validation failed:', error);
      
      clearCache();
      
      const is403Error = error?.status === 403 || 
                        error?.message?.includes('Authentication required') || 
                        error?.message?.includes('Access denied') ||
                        error?.message?.includes('403');
      
      const isTimeoutError = error instanceof TimeoutError;
      
      if (is403Error) {
        console.warn('🚨 403 error in session validation - possible RLS policy issue');
      } else if (isTimeoutError) {
        console.warn('🚨 Timeout error in session validation - server overloaded');
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
      
      clearCache();
      
      let refreshedSessionData;
      try {
        refreshedSessionData = await withTimeout(
          supabase.auth.refreshSession(),
          OPTIMIZED_TIMEOUT,
          "[SessionValidationService] Timeout refreshing session"
        );
      } catch (timeoutError) {
        console.warn('⚠️ Session refresh timed out');
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: 'Session refresh timeout'
        };
      }
      
      if (refreshedSessionData.error) {
        console.warn('⚠️ Session refresh error:', refreshedSessionData.error);
        return {
          isValid: false,
          session: null,
          user: null,
          needsRefresh: false,
          error: refreshedSessionData.error.message
        };
      }
      
      const session = refreshedSessionData?.data?.session;

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
      sessionCache = { 
        session, 
        timestamp: Date.now(), 
        userId: session.user?.id || null 
      };
      
      return {
        isValid: true,
        session,
        user: session.user,
        needsRefresh: false
      };
      
    } catch (error) {
      console.error('💥 Session refresh error:', error);
      
      const is403Error = error?.status === 403 || 
                        error?.message?.includes('Authentication required') || 
                        error?.message?.includes('Access denied') ||
                        error?.message?.includes('403');
      
      const isTimeoutError = error instanceof TimeoutError;
      
      if (is403Error) {
        console.warn('🚨 403 error in session refresh - possible RLS policy issue');
      } else if (isTimeoutError) {
        console.warn('🚨 Timeout error in session refresh - server overloaded');
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
    refreshSession,
    clearCache
  };
};
