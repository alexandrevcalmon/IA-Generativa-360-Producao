
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
        
        // If login fails with default password, try to create/link company auth user
        if (error.message.includes('Invalid login credentials')) {
          console.log('Login failed, checking for company with email:', email);
          
          // Try to find a company with this email that doesn't have auth_user_id
          const { data: companies, error: companySearchError } = await supabase
            .from('companies')
            .select('id, contact_email, auth_user_id, name')
            .eq('contact_email', email);
          
          console.log('Company search result:', { companies, companySearchError });
          
          if (!companySearchError && companies && companies.length > 0) {
            const company = companies[0];
            console.log('Found company:', company);
            
            // Call edge function to create/link auth user
            const { data: createResult, error: createError } = await supabase.functions.invoke(
              'create-company-auth-user',
              {
                body: { email, companyId: company.id }
              }
            );
            
            console.log('Edge function result:', { createResult, createError });
            
            if (!createError && createResult?.success) {
              console.log('Company auth user created/linked, attempting login again...');
              
              // Try login again
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (!retryError && retryData.user) {
                console.log('Company login successful after auth user creation/linking');
                
                // Ensure the user has company role metadata
                await supabase.auth.updateUser({
                  data: {
                    role: 'company',
                    company_id: company.id,
                    company_name: company.name
                  }
                });
                
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
              } else {
                console.error('Retry login failed:', retryError);
                toast({
                  title: "Erro no login",
                  description: "Falha ao fazer login após criação da conta",
                  variant: "destructive",
                });
              }
            } else {
              console.error('Failed to create/link company auth user:', createError);
              toast({
                title: "Erro no login",
                description: "Falha ao criar conta da empresa",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Erro no login",
              description: "Email ou senha incorretos",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      if (data.user) {
        console.log('Sign in successful, user authenticated');
        
        // Check if this is a collaborator that needs password change
        const { data: collaborator, error: collaboratorError } = await supabase
          .from('company_users')
          .select('id, needs_password_change, company_id, name')
          .eq('auth_user_id', data.user.id)
          .maybeSingle();
        
        console.log('Collaborator check result:', { collaborator, collaboratorError });
        
        if (!collaboratorError && collaborator && collaborator.needs_password_change) {
          console.log('Collaborator needs password change, setting flag');
          
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo! Você precisa alterar sua senha.",
          });
          
          return { 
            error: null, 
            user: data.user, 
            session: data.session,
            needsPasswordChange: true 
          };
        }
        
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

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth?reset=true`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique seu email para redefinir sua senha.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
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
    resetPassword,
    changePassword,
    signOut
  };
};
