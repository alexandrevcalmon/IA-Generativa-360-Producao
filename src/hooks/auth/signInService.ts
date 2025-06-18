
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  checkCompanyUser, 
  checkCompanyByEmail, 
  createCompanyAuthUser,
  updateUserMetadata 
} from './authUtils';

export const createSignInService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Enhanced error handling with specific messages
        if (error.message.includes('Invalid login credentials')) {
          console.log('Login failed, checking for company with email:', email);
          
          const { companies, companySearchError } = await checkCompanyByEmail(email);
          
          console.log('Company search result:', { companies, companySearchError });
          
          if (!companySearchError && companies && companies.length > 0) {
            const company = companies[0];
            console.log('Found company:', company);
            
            const { data: createResult, error: createError } = await createCompanyAuthUser(email, company.id);
            
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
                await updateUserMetadata({
                  role: 'company',
                  company_id: company.id,
                  company_name: company.name
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
                  title: "Credenciais incorretas",
                  description: "Email ou senha incorretos. Verifique suas credenciais ou redefina sua senha.",
                  variant: "destructive",
                });
              }
            } else {
              console.error('Failed to create/link company auth user:', createError);
              toast({
                title: "Credenciais incorretas",
                description: "Email ou senha incorretos. Verifique suas credenciais ou redefina sua senha.",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Credenciais incorretas",
              description: "Email ou senha incorretos. Verifique suas credenciais ou redefina sua senha.",
              variant: "destructive",
            });
          }
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email não confirmado",
            description: "Verifique seu email e clique no link de confirmação antes de fazer login.",
            variant: "destructive",
          });
        } else if (error.message.includes('Too many requests')) {
          toast({
            title: "Muitas tentativas",
            description: "Aguarde alguns minutos antes de tentar novamente.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no login",
            description: "Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.",
            variant: "destructive",
          });
        }
        return { error };
      }

      if (data.user) {
        console.log('Sign in successful, user authenticated');
        
        const { collaborator, collaboratorError } = await checkCompanyUser(data.user.id);
        
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
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return { signIn };
};
