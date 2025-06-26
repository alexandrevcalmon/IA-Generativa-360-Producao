
import { supabase } from '@/integrations/supabase/client';
import { createSessionCleanupService } from './sessionCleanupService';

export const createSessionRecoveryService = () => {
  const cleanupService = createSessionCleanupService();

  const handleAuthFailure = async (error: any) => {
    console.log('🔄 Handling authentication failure:', error?.message || 'Unknown error');
    
    // Check if it's a 403 or token-related error
    if (error?.status === 403 || 
        error?.message?.includes('token') || 
        error?.message?.includes('forbidden') ||
        error?.message?.includes('unauthorized')) {
      
      console.log('🧹 Cleaning up invalid session...');
      cleanupService.clearLocalSession();
      
      try {
        // Try to refresh the session
        console.log('🔄 Attempting session refresh...');
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !data.session) {
          console.log('❌ Session refresh failed, signing out...');
          await supabase.auth.signOut({ scope: 'global' });
          return { recovered: false, shouldRedirect: true };
        }
        
        console.log('✅ Session recovered successfully');
        return { recovered: true, session: data.session };
      } catch (recoveryError) {
        console.error('💥 Session recovery failed:', recoveryError);
        await supabase.auth.signOut({ scope: 'global' });
        return { recovered: false, shouldRedirect: true };
      }
    }
    
    return { recovered: false, shouldRedirect: false };
  };

  const withRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.log(`⚠️ Attempt ${attempt + 1} failed:`, error?.message || 'Unknown error');
        
        // Handle auth failures immediately
        if (error?.status === 403) {
          const recovery = await handleAuthFailure(error);
          if (recovery.shouldRedirect) {
            throw new Error('Authentication required - redirecting to login');
          }
          if (recovery.recovered && attempt < maxRetries) {
            // Wait a bit before retrying with recovered session
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            continue;
          }
        }
        
        // If not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  };

  return {
    handleAuthFailure,
    withRetry
  };
};
