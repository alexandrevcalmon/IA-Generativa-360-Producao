
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getResetPasswordRedirectUrl } from './authUtils';
import { withTimeout, TimeoutError } from '@/lib/utils';

const DEFAULT_AUTH_TIMEOUT = 7000; // Timeout para operações de autenticação (updateUser, getUser)
const DEFAULT_DB_TIMEOUT = 10000; // Timeout mais longo para operações de banco de dados (select, update flags)


export const createPasswordService = (toast: ReturnType<typeof useToast>['toast']) => {
  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = getResetPasswordRedirectUrl();
      
      const { error } = await withTimeout(
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        }),
        DEFAULT_AUTH_TIMEOUT,
        "[PasswordService] Timeout sending reset password email"
      );
      
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

  const changePassword = async (newPassword: string) => {
    try {
      console.log('🔐 Starting password change process...');
      let updateUserError: any = null;

      try {
        const { error } = await withTimeout(
          supabase.auth.updateUser({ password: newPassword }),
          DEFAULT_AUTH_TIMEOUT,
          "[PasswordService] Timeout updating user password in Auth"
        );
        updateUserError = error;
      } catch (timeoutOrOtherError) {
        updateUserError = timeoutOrOtherError;
      }

      if (!updateUserError) {
        console.log('✅ Password changed successfully in auth, updating database flags...');
        let currentUserId: string | undefined;
        try {
          const { data: { user }, error: getUserError } = await withTimeout(
            supabase.auth.getUser(),
            DEFAULT_AUTH_TIMEOUT,
            "[PasswordService] Timeout getting user after password update"
          );

          if (getUserError) {
            console.error('⚠️ Error getting user after password update:', getUserError);
            // Proceed, but flag update might target wrong/no user if this fails critically
          }
          currentUserId = user?.id;
        } catch (timeoutOrOtherError) {
           console.error('⚠️ Timeout or error getting user after password update:', timeoutOrOtherError);
        }
        
        if (!currentUserId) {
          console.warn('⚠️ No current user ID found after password change, cannot update flags.');
          // Return success for password change itself, but flags are not updated.
          // This situation should be rare.
          return { error: null };
        }
        
        // Update password change flags with improved error handling
        // This function will also use withTimeout internally for its DB operations
        await updatePasswordChangeFlags(currentUserId);
        
        console.log('✅ Password change process completed successfully');
      } else {
        console.error('❌ Password change failed:', updateUserError);
        // Pass the specific error (could be TimeoutError)
        handlePasswordChangeError(updateUserError, toast);
      }

      return { error: updateUserError };
    } catch (error) { // This outer catch is for unexpected errors in the try block's logic
      console.error('Change password error (outer try):', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível alterar a senha. Verifique sua conexão com a internet.",
        variant: "destructive",
      });
      // Ensure a consistent return structure
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  const updatePasswordChangeFlags = async (userId: string) => {
    try {
      console.log('🔄 Updating password change flags for user:', userId);

      // Check and update company record
      try {
        const { data: company, error: companyQueryError } = await withTimeout(
          supabase
            .from('companies')
            .select('id, needs_password_change')
            .eq('auth_user_id', userId)
            .maybeSingle(),
          DEFAULT_DB_TIMEOUT,
          "[PasswordService] Timeout querying company for password flag"
        );

        if (companyQueryError) {
          console.error('⚠️ Error querying company record:', companyQueryError);
        } else if (company?.needs_password_change) {
          console.log('📊 Updating company password change flag...');
          const { error: updateError } = await withTimeout(
            supabase
              .from('companies')
              .update({
                needs_password_change: false,
                updated_at: new Date().toISOString(),
              })
              .eq('auth_user_id', userId),
            DEFAULT_DB_TIMEOUT,
            "[PasswordService] Timeout updating company password flag"
          );

          if (updateError) {
            console.error('⚠️ Could not update company password change flag:', updateError);
          } else {
            console.log('✅ Company password change flag updated successfully');
          }
        }
      } catch (error) {
        console.error('❌ Error or timeout during company flag update:', error instanceof TimeoutError ? error.message : error);
      }

      // Check and update collaborator record
      try {
        const { data: collaborator, error: collaboratorQueryError } = await withTimeout(
          supabase
            .from('company_users')
            .select('id, needs_password_change')
            .eq('auth_user_id', userId)
            .maybeSingle(),
          DEFAULT_DB_TIMEOUT,
          "[PasswordService] Timeout querying collaborator for password flag"
        );

        if (collaboratorQueryError) {
          console.error('⚠️ Error querying collaborator record:', collaboratorQueryError);
        } else if (collaborator?.needs_password_change) {
          console.log('📊 Updating collaborator password change flag...');
          const { error: updateError } = await withTimeout(
            supabase
              .from('company_users')
              .update({
                needs_password_change: false,
                updated_at: new Date().toISOString(),
              })
              .eq('auth_user_id', userId),
            DEFAULT_DB_TIMEOUT,
            "[PasswordService] Timeout updating collaborator password flag"
          );

          if (updateError) {
            console.error('⚠️ Could not update collaborator password change flag:', updateError);
          } else {
            console.log('✅ Collaborator password change flag updated successfully');
          }
        }
      } catch (error) {
        console.error('❌ Error or timeout during collaborator flag update:', error instanceof TimeoutError ? error.message : error);
      }

    } catch (error) { // This outer catch is for unexpected errors in the overall logic of this function.
      console.error('❌ Critical error updating password change flags:', error);
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
