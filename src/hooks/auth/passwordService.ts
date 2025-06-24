
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getResetPasswordRedirectUrl } from './authUtils';

export const createPasswordService = (toast: ReturnType<typeof useToast>['toast']) => {
  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = getResetPasswordRedirectUrl();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        if (error.message.includes('User not found')) {
          toast({
            title: "Email não encontrado",
            description: "Não encontramos uma conta com este email. Verifique o endereço ou crie uma nova conta.",
            variant: "destructive",
          });
        } else if (error.message.includes('For security purposes')) {
          toast({
            title: "Limite de tentativas atingido",
            description: "Por segurança, aguarde alguns minutos antes de solicitar outro email de redefinição.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao enviar email",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Email enviado com sucesso!",
          description: "Verifique sua caixa de entrada e spam para as instruções de redefinição de senha.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível enviar o email. Verifique sua conexão com a internet.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const changePassword = async (newPassword: string, userId?: string, companyUserData?: any) => {
    try {
      console.log('🔐 Starting password change process...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (!error) {
        console.log('✅ Password changed successfully in auth, updating database flags...');
        
        // Get current user to ensure we have the right ID
        const { data: { user } } = await supabase.auth.getUser();
        const currentUserId = user?.id;
        
        if (!currentUserId) {
          console.warn('⚠️ No current user found after password change');
          return { error: null };
        }
        
        // Update password change flags with improved error handling
        await updatePasswordChangeFlags(currentUserId);
        
        console.log('✅ Password change process completed successfully');
      } else {
        console.error('❌ Password change failed:', error);
        handlePasswordChangeError(error, toast);
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

  const updatePasswordChangeFlags = async (userId: string) => {
    try {
      console.log('🔄 Updating password change flags for user:', userId);
      
      // Check and update company record
      const { data: company, error: companyQueryError } = await supabase
        .from('companies')
        .select('id, needs_password_change')
        .eq('auth_user_id', userId)
        .maybeSingle();
      
      if (!companyQueryError && company?.needs_password_change) {
        console.log('📊 Updating company password change flag...');
        const { error: updateError } = await supabase
          .from('companies')
          .update({ 
            needs_password_change: false,
            updated_at: new Date().toISOString() 
          })
          .eq('auth_user_id', userId);
        
        if (updateError) {
          console.error('⚠️ Could not update company password change flag:', updateError);
        } else {
          console.log('✅ Company password change flag updated successfully');
        }
      }
      
      // Check and update collaborator record
      const { data: collaborator, error: collaboratorQueryError } = await supabase
        .from('company_users')
        .select('id, needs_password_change')
        .eq('auth_user_id', userId)
        .maybeSingle();
      
      if (!collaboratorQueryError && collaborator?.needs_password_change) {
        console.log('📊 Updating collaborator password change flag...');
        const { error: updateError } = await supabase
          .from('company_users')
          .update({ 
            needs_password_change: false,
            updated_at: new Date().toISOString() 
          })
          .eq('auth_user_id', userId);
        
        if (updateError) {
          console.error('⚠️ Could not update collaborator password change flag:', updateError);
        } else {
          console.log('✅ Collaborator password change flag updated successfully');
        }
      }
      
    } catch (error) {
      console.error('❌ Error updating password change flags:', error);
    }
  };

  const handlePasswordChangeError = (error: any, toast: any) => {
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
  };

  return { resetPassword, changePassword };
};
