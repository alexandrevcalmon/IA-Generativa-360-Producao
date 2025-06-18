
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const createSignOutService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado com sucesso!",
          description: "Até mais!",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('SignOut error:', error);
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
