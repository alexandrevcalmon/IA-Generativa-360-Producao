
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const createAuthService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        console.log('Sign in successful, user authenticated');
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        
        return { error: null, user: data.user, session: data.session };
      }
      
      return { error };
    } catch (error) {
      console.error('SignIn error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, role: string = 'student') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
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
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('SignUp error:', error);
      return { error };
    }
  };

  const changePassword = async (newPassword: string, userId?: string, companyUserData?: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (!error && companyUserData) {
        await supabase
          .from('company_users')
          .update({ needs_password_change: false })
          .eq('auth_user_id', userId);
        
        toast({
          title: "Senha alterada com sucesso!",
          description: "Sua nova senha foi definida.",
        });
      }

      return { error };
    } catch (error) {
      console.error('Change password error:', error);
      return { error };
    }
  };

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
      return { error };
    }
  };

  return {
    signIn,
    signUp,
    changePassword,
    signOut
  };
};
