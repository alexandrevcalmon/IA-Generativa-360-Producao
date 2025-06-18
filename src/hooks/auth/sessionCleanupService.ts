
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
    clearLocalSession
  };
};
