
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getRedirectUrl } from './authUtils';

export const createSignUpService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signUp = async (email: string, password: string, role: string = 'student') => {
    try {
      const redirectUrl = getRedirectUrl();
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role
          }
        }
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Conta já existe",
            description: "Uma conta com este email já existe. Tente fazer login ou redefinir sua senha.",
            variant: "destructive",
          });
        } else if (error.message.includes('Password should be at least')) {
          toast({
            title: "Senha muito fraca",
            description: "A senha deve ter pelo menos 6 caracteres.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('SignUp error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return { signUp };
};
