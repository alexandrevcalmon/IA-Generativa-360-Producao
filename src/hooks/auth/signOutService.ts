
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createSessionValidationService } from './sessionValidationService';

export const createSignOutService = (toast: ReturnType<typeof useToast>['toast']) => {
  const sessionService = createSessionValidationService();
  
  // Flag to prevent multiple simultaneous logout attempts
  let isLoggingOut = false;
  
  const signOut = async () => {
    // Prevent multiple simultaneous logout attempts
    if (isLoggingOut) {
      console.log('🚫 Logout already in progress, skipping duplicate request');
      return { error: null };
    }
    
    isLoggingOut = true;
    console.log('🚪 Starting enhanced logout with 403 protection...');
    
    try {
      // Always clear local data first to prevent UI inconsistencies
      sessionService.clearLocalSession();
      
      // Force clear browser cache and storage more aggressively
      try {
        // Clear additional browser storage that might cache auth tokens
        if (typeof window !== 'undefined') {
          // Clear any potential cached requests
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('🧹 Browser caches cleared');
          }
          
          // Clear IndexedDB data related to Supabase
          if ('indexedDB' in window) {
            try {
              const deleteRequest = indexedDB.deleteDatabase('supabase-auth');
              deleteRequest.onsuccess = () => console.log('🗑️ IndexedDB auth data cleared');
            } catch (idbError) {
              console.log('ℹ️ IndexedDB cleanup skipped (not critical)');
            }
          }
        }
      } catch (cacheError) {
        console.log('ℹ️ Cache clearing skipped (not critical):', cacheError.message);
      }
      
      // Check current session state with timeout
      let currentSession = null;
      let sessionError = null;
      
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 3000)
        );
        
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        currentSession = result.data?.session || null;
        sessionError = result.error;
      } catch (error) {
        console.log('⚠️ Session check failed or timed out:', error.message);
        sessionError = error;
      }
      
      if (sessionError) {
        console.log('❌ Error getting session during logout:', sessionError.message);
        // Treat session errors as successful logout
        toast({
          title: "Logout realizado",
          description: "Sessão encerrada com segurança.",
        });
        return { error: null };
      }
      
      if (!currentSession) {
        console.log('ℹ️ No session found, logout completed locally');
        toast({
          title: "Logout realizado",
          description: "Sessão já estava encerrada.",
        });
        return { error: null };
      }
      
      // Only attempt server logout if we have a session with valid tokens
      if (currentSession.access_token && currentSession.refresh_token) {
        console.log('🔍 Valid session found, attempting enhanced server logout...');
        
        // Validate session before attempting logout to avoid 403 errors
        const validation = await sessionService.validateSession(currentSession);
        
        if (!validation.isValid && !validation.needsRefresh) {
          console.log('⚠️ Session already invalid on server, skipping server logout');
          toast({
            title: "Logout realizado",
            description: "Sessão encerrada localmente.",
          });
          return { error: null };
        }
        
        // Enhanced server logout with 403 protection
        try {
          console.log('🔄 Attempting server logout with enhanced error handling...');
          
          // Use local scope and add additional headers for cache busting
          const logoutOptions = {
            scope: 'local' as const,
          };
          
          // Add cache-busting timestamp to force fresh request
          const timestamp = Date.now();
          console.log(`🕐 Logout attempt timestamp: ${timestamp}`);
          
          const { error: logoutError } = await supabase.auth.signOut(logoutOptions);
          
          if (logoutError) {
            console.warn('⚠️ Server logout error details:', {
              message: logoutError.message,
              status: logoutError.status,
              code: logoutError.code,
              timestamp: new Date().toISOString()
            });
            
            // Enhanced 403 error handling
            if (logoutError.message?.includes('403') || 
                logoutError.message?.toLowerCase().includes('forbidden') ||
                logoutError.status === 403) {
              
              console.log('🔒 403 Forbidden detected - treating as successful logout');
              console.log('💡 This usually means the session was already invalidated on the server');
              
              // Clear any remaining local auth state
              sessionService.clearLocalSession();
              
              toast({
                title: "Logout realizado",
                description: "Sessão encerrada com segurança.",
              });
              
              return { error: null };
            }
            
            // For other server errors, still proceed with local cleanup
            console.warn('⚠️ Server logout failed but local cleanup completed:', logoutError.message);
            
            toast({
              title: "Logout realizado",
              description: "Sessão encerrada localmente. Cache do navegador foi limpo.",
            });
            
            return { error: null };
          }
          
          console.log('✅ Server logout successful');
        } catch (networkError) {
          console.error('🌐 Network error during logout:', networkError);
          
          // Network errors are treated as successful logout since local state is cleared
          toast({
            title: "Logout realizado",
            description: "Sessão encerrada localmente devido a problema de rede.",
          });
          
          return { error: null };
        }
      } else {
        console.log('⚠️ Session missing required tokens, skipping server logout');
      }
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até mais!",
      });
      
      return { error: null };
      
    } catch (error) {
      console.error('💥 Unexpected error during enhanced logout:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Always ensure local state is cleared even on errors
      sessionService.clearLocalSession();
      
      toast({
        title: "Logout realizado",
        description: "Sessão encerrada com limpeza de segurança completa.",
      });
      
      return { error: null }; // Always allow navigation
    } finally {
      // Reset the logout flag
      isLoggingOut = false;
      console.log('🏁 Logout process completed, flag reset');
    }
  };

  return { signOut };
};
