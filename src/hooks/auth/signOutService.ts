
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createSessionValidationService } from './sessionValidationService';

export const createSignOutService = (toast: ReturnType<typeof useToast>['toast']) => {
  const sessionService = createSessionValidationService();
  
  const signOut = async () => {
    console.log('🚪 Enhanced signOut initiated...');
    
    try {
      // First, check if we have a valid session to sign out from
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.log('ℹ️ No active session found, performing local cleanup only');
        sessionService.clearLocalSession();
        
        toast({
          title: "Logout realizado",
          description: "Sessão local limpa com sucesso.",
        });
        
        return { error: null };
      }
      
      console.log('🔍 Found active session, proceeding with server logout...', {
        sessionId: currentSession.access_token?.substring(0, 10) + '...',
        expiresAt: new Date(currentSession.expires_at! * 1000).toISOString()
      });
      
      // Validate session before attempting logout
      const validation = await sessionService.validateSession(currentSession);
      
      if (!validation.isValid && !validation.needsRefresh) {
        console.log('⚠️ Session already invalid, skipping server logout');
        sessionService.clearLocalSession();
        
        toast({
          title: "Logout realizado",
          description: "Sessão já estava inválida, limpeza local concluída.",
        });
        
        return { error: null };
      }
      
      // Attempt server logout
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out from this browser/device
      });
      
      if (error) {
        console.error('❌ Server signOut error:', error);
        
        // Handle specific known errors gracefully
        if (error.message.includes('Session not found') || 
            error.message.includes('session_not_found') ||
            error.message.includes('Invalid session')) {
          
          console.log('ℹ️ Session not found on server, proceeding with local cleanup');
          sessionService.clearLocalSession();
          
          toast({
            title: "Logout realizado",
            description: "Sessão encerrada localmente.",
          });
          
          return { error: null };
        }
        
        // For other errors, still clean local state but show warning
        console.warn('⚠️ Server logout failed, but cleaning local state:', error.message);
        sessionService.clearLocalSession();
        
        toast({
          title: "Logout parcial",
          description: "Sessão local limpa, mas pode ainda estar ativa no servidor.",
          variant: "destructive",
        });
        
        return { error: null }; // Don't block navigation
      }
      
      console.log('✅ Server logout successful');
      sessionService.clearLocalSession();
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até mais!",
      });
      
      return { error: null };
      
    } catch (error) {
      console.error('💥 Unexpected signOut error:', error);
      
      // Always clean local state on any error
      sessionService.clearLocalSession();
      
      toast({
        title: "Logout realizado",
        description: "Sessão encerrada com limpeza de emergência.",
      });
      
      return { error: null }; // Always allow navigation
    }
  };

  return { signOut };
};
