
import { supabase } from '@/integrations/supabase/client';

export const createSessionCleanupService = () => {
  const clearLocalSession = () => {
    console.log('🧹 Starting enhanced local session cleanup...');
    
    try {
      // Clear specific auth-related localStorage items with enhanced logging
      const authKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('supabase.auth.token') || 
        key.includes('supabase-auth-token') ||
        key.includes('auth-token') ||
        key.startsWith('supabase_auth_') ||
        key.includes('sb-') ||
        key.includes('supabase') // Additional Supabase keys
      );
      
      console.log(`🔍 Found ${authKeys.length} auth-related localStorage keys to clear:`, authKeys);
      
      authKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`🗑️ Removed localStorage: ${key}`);
        } catch (removeError) {
          console.warn(`⚠️ Could not remove localStorage key ${key}:`, removeError);
        }
      });
      
      // Clear session storage with enhanced logging
      const sessionKeys = Object.keys(sessionStorage).filter(key =>
        key.includes('supabase') || key.includes('auth') || key.includes('sb-')
      );
      
      console.log(`🔍 Found ${sessionKeys.length} auth-related sessionStorage keys to clear:`, sessionKeys);
      
      sessionKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
          console.log(`🗑️ Removed sessionStorage: ${key}`);
        } catch (removeError) {
          console.warn(`⚠️ Could not remove sessionStorage key ${key}:`, removeError);
        }
      });
      
      // Force clear any remaining Supabase-related data
      try {
        // Clear all keys that might contain auth data
        const allLocalKeys = Object.keys(localStorage);
        const suspiciousKeys = allLocalKeys.filter(key => 
          key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('session') ||
          key.toLowerCase().includes('user') ||
          key.startsWith('supabase') ||
          key.includes('refresh') ||
          key.includes('access')
        );
        
        if (suspiciousKeys.length > 0) {
          console.log(`🔍 Additional cleanup - found ${suspiciousKeys.length} suspicious keys:`, suspiciousKeys);
          suspiciousKeys.forEach(key => {
            try {
              localStorage.removeItem(key);
              console.log(`🗑️ Deep cleanup removed: ${key}`);
            } catch (removeError) {
              console.warn(`⚠️ Could not remove suspicious key ${key}:`, removeError);
            }
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

  const forceCleanCorruptedTokens = async () => {
    console.log('🚨 Force cleaning corrupted tokens...');
    
    try {
      // Clear all storage first
      clearLocalSession();
      
      // Force clear from Supabase client
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.warn('⚠️ Error during force signout:', error);
      }
      
      // Additional manual cleanup of specific Supabase storage keys
      const commonSupabaseKeys = [
        'sb-swmxqjdvungochdjvtjg-auth-token',
        'supabase.auth.token',
        'sb-auth-token',
        'supabase_auth_token'
      ];
      
      commonSupabaseKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (error) {
          console.warn(`Could not remove ${key}:`, error);
        }
      });
      
      console.log('✅ Force cleanup completed');
    } catch (error) {
      console.error('❌ Error during force cleanup:', error);
    }
  };

  return {
    clearLocalSession,
    forceCleanCorruptedTokens
  };
};
