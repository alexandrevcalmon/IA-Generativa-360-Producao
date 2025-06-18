
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  checkCompanyUser, 
  checkCompanyByEmail, 
  createCompanyAuthUser,
  updateUserMetadata 
} from './authUtils';

export const createSignInService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signIn = async (email: string, password: string, role?: string) => {
    try {
      console.log('Starting sign in process for:', email, 'with role:', role);

      // Producer Path
      if (role === 'producer') {
        console.log('Attempting Producer login for:', email);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          console.error('Producer sign in error:', error.message);
          toast({ title: "Erro no login", description: error.message, variant: "destructive" });
          return { error };
        }

        if (data.user) {
          console.log('Producer login successful for:', email);
          if (data.user.user_metadata?.role !== 'producer') {
            console.log('Updating user metadata to producer role');
            await updateUserMetadata({ role: 'producer' });
          }
          toast({ title: "Login realizado com sucesso!", description: "Bem-vindo, Produtor!" });
          return { error: null, user: data.user, session: data.session, needsPasswordChange: false };
        }
      }

      // Company Path & Default Path (Student/Collaborator) will be handled below
      // This initial signInWithPassword will serve as the first attempt for Company and the main attempt for Default
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // COMPANY PATH: Handle "Invalid login credentials" for potential company user creation
        if (role === 'company' && error.message.includes('Invalid login credentials')) {
          console.log('Company login failed with invalid credentials, checking for company by email:', email);
          const { companies, companySearchError } = await checkCompanyByEmail(email);
          console.log('Company search result:', { companies, companySearchError });

          if (!companySearchError && companies && companies.length > 0) {
            const company = companies[0];
            console.log('Found company:', company.name);
            const { data: createResult, error: createError } = await createCompanyAuthUser(email, company.id);
            console.log('createCompanyAuthUser result:', { createResult, createError });

            if (!createError && createResult?.success) {
              console.log('Company auth user created/linked, attempting login again...');
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({ email, password });

              if (!retryError && retryData.user) {
                console.log('Company login successful after auth user creation/linking');
                await updateUserMetadata({
                  role: 'company',
                  company_id: company.id,
                  company_name: company.name,
                });
                toast({ title: "Login realizado com sucesso!", description: "Bem-vindo! Você precisa alterar sua senha." });
                return { error: null, user: retryData.user, session: retryData.session, needsPasswordChange: true };
              } else {
                console.error('Retry login failed for company:', retryError?.message);
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
        console.log('Sign in successful for user:', data.user.email);

        // COMPANY PATH (successful initial login)
        if (role === 'company') {
          console.log('Handling successful initial login for Company user:', data.user.email);
          if (data.user.user_metadata?.role !== 'company') {
            console.log('User metadata role is not company, but role=company was passed. Updating metadata.');
            // Attempt to get company_id and company_name from existing metadata or make a call
            // This part might need adjustment based on how company_id/name are sourced for existing users
            // For now, assuming it might be missing and needs an update post a broader check or default.
            await updateUserMetadata({ role: 'company' });
          }
          // Check needs_password_change for company user
          // This requires fetching company details, potentially via a modified checkCompanyUser or new function
          // For now, let's assume a function getCompanyDetails(userId) exists or adapt checkCompanyUser
          const { companyData, error: companyError } = await checkCompanyByEmail(data.user.email || ''); // Or use user_id if more direct
          if (companyError || !companyData || companyData.length === 0) {
            console.error('Could not verify company details for password change check:', companyError);
            // Defaulting to false, or handle error as critical
            toast({ title: "Login realizado com sucesso!", description: "Bem-vindo!" });
            return { error: null, user: data.user, session: data.session, needsPasswordChange: false };
          }
          const company = companyData[0];
          // Assuming the company table has a needs_password_change field directly related to the company admin
          // or the auth user linked to the company. This logic may need refinement based on schema.
          // If needs_password_change is per company user (collaborator-like), then checkCompanyUser is more appropriate.
          // Let's assume for now the company itself (via its primary auth contact/admin) has this flag.
          const needsPasswordChange = company.auth_user_id === data.user.id ? company.needs_password_change || false : false;

          if (needsPasswordChange) {
            toast({ title: "Login realizado com sucesso!", description: "Bem-vindo! Você precisa alterar sua senha." });
          } else {
            toast({ title: "Login realizado com sucesso!", description: "Bem-vindo de volta." });
          }
          return { error: null, user: data.user, session: data.session, needsPasswordChange };
        }

        // DEFAULT PATH (Student/Collaborator)
        console.log('Handling default path (Student/Collaborator) for user:', data.user.email);
        const { collaborator, collaboratorError } = await checkCompanyUser(data.user.id);
        console.log('Collaborator check result:', { collaborator, collaboratorError });

        if (!collaboratorError && collaborator) {
          console.log('User is a collaborator for company:', collaborator.companies?.name);
          if (data.user.user_metadata?.role !== 'collaborator') {
            await updateUserMetadata({
              role: 'collaborator',
              company_id: collaborator.company_id,
              company_name: collaborator.companies?.name
            });
          }
          if (collaborator.needs_password_change) {
            console.log('Collaborator needs password change.');
            toast({ title: "Login realizado com sucesso!", description: "Bem-vindo! Você precisa alterar sua senha." });
            return { error: null, user: data.user, session: data.session, needsPasswordChange: true };
          }
        } else {
          // Not a collaborator, or error in check. Assume student if no role.
          if (!data.user.user_metadata?.role) {
            console.log('User is not a collaborator and has no role, defaulting to student.');
            await updateUserMetadata({ role: 'student' });
          }
        }
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        
        return { error: null, user: data.user, session: data.session, needsPasswordChange: false };
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
