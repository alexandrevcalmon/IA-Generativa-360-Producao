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
        // Proceed to update flags regardless of whether updateUserError was initially null,
        // as we might now handle specific errors like "password already changed".
      } else if (updateUserError && updateUserError.message === 'New password should be different from the old password.') {
        console.warn('⚠️ Password in Auth is already set to the new password. Attempting to clear DB flags.');
        // Treat as "success" for Auth, but we still need to clear DB flags.
        // Clear the error so we can proceed to updatePasswordChangeFlags.
        // The final return will still indicate original error if flag update fails.
      } else {
        // For any other error (TimeoutError, other AuthApiErrors), handle and return.
        console.error('❌ Password change failed:', updateUserError);
        handlePasswordChangeError(updateUserError, toast);
        return { error: updateUserError };
      }

      // Common logic for successful auth update or "password already set" scenario:
      // Attempt to get user and update DB flags.
      let currentUserId: string | undefined;
      try {
        const { data: { user }, error: getUserError } = await withTimeout(
          supabase.auth.getUser(),
          DEFAULT_AUTH_TIMEOUT,
          "[PasswordService] Timeout getting user after password update attempt"
        );

        if (getUserError) {
          console.error('⚠️ Error getting user for flag update:', getUserError);
          // If we can't get the user, we can't update flags.
          // Return the original updateUserError if it exists and was the "already changed" type,
          // otherwise null because auth part might have been considered "ok".
          // This path is tricky, as password might be set in Auth but flags not.
          return { error: (updateUserError?.message === 'New password should be different from the old password.') ? null : getUserError };
        }
        currentUserId = user?.id;
      } catch (timeoutOrOtherError) {
        console.error('⚠️ Timeout or other error getting user for flag update:', timeoutOrOtherError);
        return { error: (updateUserError?.message === 'New password should be different from the old password.') ? null : timeoutOrOtherError as Error };
      }

      if (!currentUserId) {
        console.warn('⚠️ No current user ID found, cannot update flags.');
        return { error: (updateUserError?.message === 'New password should be different from the old password.') ? null : new Error("User ID not found for flag update") };
      }

      try {
        await updatePasswordChangeFlags(currentUserId);
        console.log('✅ Password change process (including flag update) completed successfully.');
        // If updateUserError was the "already changed" error, and flags are now updated,
        // then the overall operation can be considered a success.
        return { error: (updateUserError?.message === 'New password should be different from the old password.') ? null : updateUserError };
      } catch (flagUpdateError) {
        console.error('❌ Failed to update password change flags:', flagUpdateError);
        // If flag update fails, return this new error, or the original updateUserError if it's more critical.
        return { error: flagUpdateError as Error || updateUserError };
      }

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
        const companyResult = await withTimeout(
          supabase
            .from('companies')
            .select('id, needs_password_change')
            .eq('auth_user_id', userId)
            .maybeSingle(),
          DEFAULT_DB_TIMEOUT,
          "[PasswordService] Timeout querying company for password flag"
        );

        if (companyResult.error) {
          console.error('⚠️ Error querying company record:', companyResult.error);
        } else if (companyResult.data?.needs_password_change) {
          console.log('📊 Updating company password change flag...');
          const updateResult = await withTimeout(
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

          if (updateResult.error) {
            console.error('⚠️ Could not update company password change flag:', updateResult.error);
          } else {
            console.log('✅ Company password change flag updated successfully');
          }
        }
      } catch (error) {
        console.error('❌ Error or timeout during company flag update:', error instanceof TimeoutError ? error.message : error);
      }

      // Check and update collaborator record
      try {
        const collaboratorResult = await withTimeout(
          supabase
            .from('company_users')
            .select('id, needs_password_change')
            .eq('auth_user_id', userId)
            .maybeSingle(),
          DEFAULT_DB_TIMEOUT,
          "[PasswordService] Timeout querying collaborator for password flag"
        );

        if (collaboratorResult.error) {
          console.error('⚠️ Error querying collaborator record:', collaboratorResult.error);
        } else if (collaboratorResult.data?.needs_password_change) {
          console.log('📊 Updating collaborator password change flag...');
          const updateResult = await withTimeout(
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

          if (updateResult.error) {
            console.error('⚠️ Could not update collaborator password change flag:', updateResult.error);
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
