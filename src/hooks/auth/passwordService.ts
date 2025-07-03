
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getResetPasswordRedirectUrl } from './authUtils';
import { logEmailAttempt } from '@/utils/emailDebugger';

export const createPasswordService = (toast: ReturnType<typeof useToast>['toast']) => {
  const resetPassword = async (email: string) => {
    try {
      console.log('🔐 Starting password reset for email:', email);
      const redirectUrl = getResetPasswordRedirectUrl();
      console.log('🔗 Reset redirect URL:', redirectUrl);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Email inválido",
          description: "Por favor, digite um endereço de email válido.",
          variant: "destructive",
        });
        return { error: { message: "Invalid email format" } };
      }
      
      // Use Supabase's built-in reset password system with enhanced configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
        captchaToken: undefined, // Allow bypassing captcha for testing
      });
      
      if (error) {
        console.error('❌ Reset password error:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // Enhanced error handling with more specific cases
        if (error.message.includes('User not found') || error.message.includes('not found')) {
          toast({
            title: "Email não encontrado",
            description: "Não encontramos uma conta com este email. Verifique o endereço ou crie uma nova conta.",
            variant: "destructive",
          });
        } else if (error.message.includes('For security purposes') || error.message.includes('rate limit')) {
          toast({
            title: "Limite de tentativas atingido",
            description: "Por segurança, aguarde alguns minutos antes de solicitar outro email de redefinição.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email não confirmado",
            description: "Sua conta precisa ser confirmada antes de redefinir a senha. Verifique seu email de cadastro.",
            variant: "destructive",
          });
        } else if (error.message.includes('SMTP') || error.message.includes('email')) {
          console.error('🚨 SMTP Configuration Error detected');
          toast({
            title: "Erro de configuração de email",
            description: "Há um problema com o envio de emails. Entre em contato com o suporte.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao enviar email",
            description: `Erro: ${error.message}. Tente novamente em alguns minutos.`,
            variant: "destructive",
          });
        }
        
        // Log debugging information
        logEmailAttempt(email, false, error);
        return { error };
      } else {
        console.log('✅ Password reset email sent successfully');
        logEmailAttempt(email, true);
        toast({
          title: "Email enviado com sucesso!",
          description: "Verifique sua caixa de entrada e spam para as instruções de redefinição de senha. O email pode levar alguns minutos para chegar.",
        });
        return { error: null };
      }
    } catch (error: any) {
      console.error('💥 Critical password reset error:', error);
      
      // Check if it's a network error
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro inesperado. Tente novamente em alguns minutos.",
          variant: "destructive",
        });
      }
      
      return { error: error };
    }
  };

  const changePassword = async (newPassword: string, userId?: string, companyUserData?: any) => {
    try {
      console.log('🔐 Changing password for user:', userId);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (!error) {
        console.log('✅ Password changed successfully, updating flags...');
        
        // Get current user to ensure we have the right ID
        const { data: { user } } = await supabase.auth.getUser();
        const currentUserId = user?.id;
        
        if (!currentUserId) {
          console.warn('⚠️ No current user found after password change');
          return { error: null };
        }
        
        // Check if it's a company user and update their password change flag
        console.log('📊 Checking for company record...');
        const { data: company, error: companyQueryError } = await supabase
          .from('companies')
          .select('id, needs_password_change')
          .eq('auth_user_id', currentUserId)
          .maybeSingle();
        
        if (!companyQueryError && company) {
          console.log('📊 Found company record, updating password change flag...');
          const { error: updateError } = await supabase
            .from('companies')
            .update({ 
              needs_password_change: false,
              updated_at: new Date().toISOString() 
            })
            .eq('auth_user_id', currentUserId);
          
          if (updateError) {
            console.error('⚠️ Could not update company password change flag:', updateError);
          } else {
            console.log('✅ Company password change flag updated successfully');
          }
        } else {
          console.log('📊 No company record found, checking for collaborator...');
          
          // Check if it's a collaborator
          const { data: collaborator, error: collaboratorQueryError } = await supabase
            .from('company_users')
            .select('id, needs_password_change')
            .eq('auth_user_id', currentUserId)
            .maybeSingle();
          
          if (!collaboratorQueryError && collaborator) {
            console.log('📊 Found collaborator record, updating password change flag...');
            const { error: updateError } = await supabase
              .from('company_users')
              .update({ 
                needs_password_change: false,
                updated_at: new Date().toISOString() 
              })
              .eq('auth_user_id', currentUserId);
            
            if (updateError) {
              console.error('⚠️ Could not update collaborator password change flag:', updateError);
            } else {
              console.log('✅ Collaborator password change flag updated successfully');
            }
          } else {
            console.log('📊 No collaborator record found either');
          }
        }
        
        // Force a small delay to ensure database updates are committed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Senha alterada com sucesso!",
          description: "Sua nova senha foi definida.",
        });
      } else {
        console.error('❌ Password change failed:', error);
        if (error.message.includes('New password should be different')) {
          toast({
            title: "Senha inválida",
            description: "A nova senha deve ser diferente da atual.",
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
            title: "Erro ao alterar senha",
            description: error.message,
            variant: "destructive",
          });
        }
      }

      return { error };
    } catch (error) {
      console.error('Change password error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível alterar a senha. Verifique sua conexão com a internet.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return { resetPassword, changePassword };
};
