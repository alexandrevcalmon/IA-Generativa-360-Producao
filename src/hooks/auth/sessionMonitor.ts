
import { createSessionValidationService } from './sessionValidationService';
import { createCriticalErrorHandler } from './criticalErrorHandler';

interface SessionMonitorProps {
  clearUserState: () => void;
}

export function createSessionMonitor(props: SessionMonitorProps) {
  const { clearUserState } = props;
  const sessionService = createSessionValidationService();
  const errorHandler = createCriticalErrorHandler();

  const setupSessionMonitoring = (isMounted: React.MutableRefObject<boolean>) => {
    const checkSession = async () => {
      if (!isMounted.current) return;
      
      try {
        const validation = await sessionService.validateSession();
        
        if (!validation.isValid) {
          if (validation.needsRefresh) {
            console.log('🔄 Session expired during monitoring, attempting refresh...');
            const refreshResult = await sessionService.refreshSession();
            
            if (!refreshResult.isValid) {
              console.log('❌ Session refresh failed during monitoring, clearing state...');
              
              // Check if it's a critical error
              const isTokenError = errorHandler.isTokenError({ message: refreshResult.error });
              if (isTokenError) {
                await errorHandler.handleCriticalAuthError({ message: refreshResult.error }, clearUserState);
              } else {
                clearUserState();
              }
            }
          } else if (validation.session) {
            // Session exists but is invalid (not just expired)
            console.log('⚠️ Invalid session detected during monitoring, clearing state...');
            clearUserState();
          } else if (validation.error) {
            // Handle validation errors
            const isTokenError = errorHandler.isTokenError({ message: validation.error });
            if (isTokenError) {
              console.log('🚨 Critical token error during monitoring, forcing cleanup...');
              await errorHandler.handleCriticalAuthError({ message: validation.error }, clearUserState);
            }
          }
        }
      } catch (error) {
        console.error('❌ Session monitoring error:', error);
        
        // Handle critical errors during monitoring
        const wasHandled = await errorHandler.handleCriticalAuthError(error, clearUserState);
        
        if (!wasHandled) {
          // Don't clear state on non-critical monitoring errors to avoid constant logouts
          console.warn('Non-critical session monitoring error:', error);
        }
      }
    };
    
    // Check every 2 minutes instead of 5 for better responsiveness
    const refreshTimer = setInterval(checkSession, 2 * 60 * 1000);
    return refreshTimer;
  };

  return { setupSessionMonitoring };
}
