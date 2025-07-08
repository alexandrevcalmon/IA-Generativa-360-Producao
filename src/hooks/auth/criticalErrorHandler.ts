import { supabase } from '@/integrations/supabase/client';
import { createSessionCleanupService } from './sessionCleanupService';

export const createCriticalErrorHandler = () => {
  const cleanupService = createSessionCleanupService();

  const isTokenError = (error: any): boolean => {
    if (!error) return false;
    
    const message = error.message || error.toString();
    return message.includes('refresh_token_not_found') ||
           message.includes('Invalid Refresh Token') ||
           message.includes('refresh token not found') ||
           message.includes('JWT expired') ||
           message.includes('invalid_grant');
  };

  const handleCriticalAuthError = async (error: any, clearStateCallback?: () => void) => {
    if (!isTokenError(error)) {
      return false; // Not a critical error
    }

    console.log('🚨 Critical auth error detected, initiating emergency cleanup...', {
      error: error.message,
      timestamp: new Date().toISOString()
    });

    try {
      // Force cleanup of corrupted tokens
      await cleanupService.forceCleanCorruptedTokens();
      
      // Clear application state if callback provided
      if (clearStateCallback) {
        clearStateCallback();
      }

      console.log('✅ Emergency cleanup completed');
      return true; // Handled
    } catch (cleanupError) {
      console.error('❌ Error during emergency cleanup:', cleanupError);
      return true; // Still handled, but with warnings
    }
  };

  const withErrorHandler = async <T>(
    operation: () => Promise<T>, 
    clearStateCallback?: () => void
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      const wasHandled = await handleCriticalAuthError(error, clearStateCallback);
      if (wasHandled) {
        return null; // Return null to indicate operation was aborted due to critical error
      }
      throw error; // Re-throw if not a critical error
    }
  };

  return {
    isTokenError,
    handleCriticalAuthError,
    withErrorHandler
  };
};