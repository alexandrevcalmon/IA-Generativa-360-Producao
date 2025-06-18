
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
        // If login fails, check if this is a company trying to log in for the first time
        if (error.message.includes('Invalid login credentials') && password === 'ia360graus') {
          console.log('Attempting to create company auth user...');
          
          // Try to find a company with this email
          const { data: companies, error: companySearchError } = await supabase
            .from('companies')
            .select('id, contact_email')
            .eq('contact_email', email)
            .is('auth_user_id', null);
          
          if (!companySearchError && companies && companies.length > 0) {
            const company = companies[0];
            
            // Call edge function to create auth user
            const { data: createResult, error: createError } = await supabase.functions.invoke(
              'create-company-auth-user',
              {
                body: { email, companyId: company.id }
              }
            );
            
            if (!createError && createResult?.success) {
              console.log('Company auth user created, attempting login again...');
              
              // Try login again
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (!retryError && retryData.user) {
                console.log('Company login successful after auth user creation');
                
                toast({
                  title: "Login realizado com sucesso!",
                  description: "Bem-vindo! Você precisa alterar sua senha.",
                });
                
                return { 
                  error: null, 
                  user: retryData.user, 
                  session: retryData.session,
                  needsPasswordChange: true 
                };
              }
            }
          }
        }
        
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

      if (!error) {
        // Check if it's a company user and update their password change flag
        if (userId) {
          const { data: company } = await supabase
            .from('companies')
            .select('id')
            .eq('auth_user_id', userId)
            .maybeSingle();
          
          if (company) {
            await supabase
              .from('companies')
              .update({ needs_password_change: false })
              .eq('auth_user_id', userId);
          }
        }
        
        // Handle company_users (collaborators)
        if (companyUserData) {
          await supabase
            .from('company_users')
            .update({ needs_password_change: false })
            .eq('auth_user_id', userId);
        }
        
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
