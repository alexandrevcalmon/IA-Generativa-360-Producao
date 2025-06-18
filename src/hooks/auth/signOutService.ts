import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createSessionValidationService } from './sessionValidationService';

export const createSignOutService = (toast: ReturnType<typeof useToast>['toast']) => {
  const sessionService = createSessionValidationService();
  
  const signOut = async () => {
    try {
      console.log('🚪 Starting enhanced signOut process...');
      
      // First validate current session
      const validation = await sessionService.validateSession();
      console.log('🔍 Session validation result:', validation);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Supabase signOut error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Session not found') || error.message.includes('session_not_found')) {
          console.log('ℹ️ Session already invalid, proceeding with local cleanup...');
          
          // Clear local data even if session doesn't exist on server
          sessionService.clearLocalSession();
          
          toast({
            title: "Logout realizado com sucesso!",
            description: "Sessão encerrada.",
          });
          
          return { error: null };
        } else {
          // Other errors
          toast({
            title: "Erro ao sair",
            description: error.message,
            variant: "destructive",
          });
          return { error };
        }
      } else {
        console.log('✅ Supabase signOut successful');
        
        // Clear local data after successful logout
        sessionService.clearLocalSession();
        
        toast({
          title: "Logout realizado com sucesso!",
          description: "Até mais!",
        });
        
        return { error: null };
      }
    } catch (error) {
      console.error('💥 SignOut error:', error);
      
      // Force local cleanup on any error
      sessionService.clearLocalSession();
      
      toast({
        title: "Sessão encerrada",
        description: "Logout realizado com limpeza local.",
      });
      
      return { error: null }; // Return success to allow navigation
    }
  };

  return { signOut };
};
