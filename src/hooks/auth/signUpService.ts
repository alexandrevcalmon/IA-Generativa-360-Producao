// src/hooks/auth/signUpService.ts
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getRedirectUrl } from './authUtils';

export const createSignUpService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signUp = async (email: string, password: string, role: string = 'student') => {
    console.log(`[SignUpService] Attempting sign-up for email: ${email}, role: ${role}`);
    try {
      const redirectUrl = getRedirectUrl();
      console.log(`[SignUpService] Using redirect URL: ${redirectUrl} for email: ${email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { // This data is stored in user_metadata
            role: role,
            name: email // Default name to email, can be updated later from profile
          }
        }
      });
      
      if (error) {
        console.error(`[SignUpService] Error during sign-up for ${email}: ${error.message}`);
        if (error.message.includes('User already registered')) {
          console.warn(`[SignUpService] Attempt to sign up with already registered email: ${email}`);
          toast({
            title: "Usuário já cadastrado",
            description: "Este email já está em uso. Tente fazer login ou redefinir sua senha.",
            variant: "destructive",
          });
        } else if (error.message.includes('Password should be at least')) {
          console.warn(`[SignUpService] Password too weak for ${email}: ${error.message}`);
          toast({
            title: "Senha fraca",
            description: "A senha deve ter pelo menos 6 caracteres.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no Cadastro",
            description: error.message || "Ocorreu um erro desconhecido.",
            variant: "destructive",
          });
        }
        return { error, user: null, session: null }; // Ensure consistent return structure
      }

      // data.user should not be null if there is no error, but Supabase types might allow it.
      if (data.user) {
        console.log(`[SignUpService] Sign-up initiated successfully for ${email}. User ID: ${data.user.id}. Role: ${role}. Awaiting email confirmation.`);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      } else {
        // This case should ideally not happen if error is null.
        console.warn(`[SignUpService] Sign-up for ${email} returned no error but no user object either. This might indicate an issue.`);
        toast({
          title: "Cadastro Incompleto",
          description: "O processo de cadastro não foi totalmente concluído. Por favor, tente novamente.",
          variant: "warning",
        });
      }
      return { error: null, user: data.user, session: data.session };
    } catch (e: any) {
      console.error(`[SignUpService] Critical unhandled error during sign-up for ${email}:`, e.message, e.stack);
      toast({
        title: "Erro Crítico no Cadastro",
        description: "Um problema inesperado ocorreu. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return { error: { message: e.message, name: "CriticalErrorSignUpService" }, user: null, session: null };
    }
  };
  return { signUp };
};
