
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createSessionValidationService } from './sessionValidationService';

export const createSignOutService = (toast: ReturnType<typeof useToast>['toast']) => {
  const sessionService = createSessionValidationService();
  
  const signOut = async () => {
    console.log('🚪 Starting enhanced logout process...');
    
    try {
      // Always clear local data first to prevent UI inconsistencies
      sessionService.clearLocalSession();
      
      // Check if we have a session that might be valid on the server
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('❌ Error getting session during logout:', sessionError.message);
        // Session is already invalid, just show success message
        toast({
          title: "Logout realizado",
          description: "Sessão encerrada com sucesso.",
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
        console.log('🔍 Valid session found, attempting server logout...');
        
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
        
        // Attempt server logout with local scope only to avoid global session conflicts
        const { error: logoutError } = await supabase.auth.signOut({
          scope: 'local'
        });
        
        if (logoutError) {
          console.warn('⚠️ Server logout failed, but local cleanup completed:', logoutError.message);
          
          // Don't treat server logout failure as a critical error
          // The important thing is that local state is cleared
          toast({
            title: "Logout realizado",
            description: "Sessão encerrada localmente. Pode ser necessário limpar o cache do navegador.",
          });
          
          return { error: null };
        }
        
        console.log('✅ Server logout successful');
      } else {
        console.log('⚠️ Session missing required tokens, skipping server logout');
      }
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até mais!",
      });
      
      return { error: null };
      
    } catch (error) {
      console.error('💥 Unexpected error during logout:', error);
      
      // Always ensure local state is cleared even on errors
      sessionService.clearLocalSession();
      
      toast({
        title: "Logout realizado",
        description: "Sessão encerrada com limpeza de segurança.",
      });
      
      return { error: null }; // Always allow navigation
    }
  };

  return { signOut };
};
