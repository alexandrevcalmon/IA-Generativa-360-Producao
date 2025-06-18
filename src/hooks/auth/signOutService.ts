
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const createSignOutService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signOut = async () => {
    try {
      console.log('🚪 Starting signOut process...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ SignOut error:', error);
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      } else {
        console.log('✅ SignOut successful');
        toast({
          title: "Logout realizado com sucesso!",
          description: "Até mais!",
        });
        
        // Clear any cached data
        localStorage.clear();
        sessionStorage.clear();
        
        return { error: null };
      }
    } catch (error) {
      console.error('💥 SignOut error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return { signOut };
};
