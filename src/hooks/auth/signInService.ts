// src/hooks/auth/signInService.ts
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  checkCompanyUser, 
  checkCompanyByEmail, 
  createCompanyAuthUser,
  updateUserMetadata 
} from './authUtils'; // checkCompanyUser returns { collaborator, collaboratorError }

export const createSignInService = (toast: ReturnType<typeof useToast>['toast']) => {
  const signIn = async (email: string, password: string, role?: string) => {
    try {
      console.log(`[SignInServiceV3] Attempting sign-in. Email: ${email}, Intended Role: ${role}`);

      // Branch 1: Producer Login
      if (role === 'producer') {
        console.log(`[SignInServiceV3] Path: Producer. Email: ${email}`);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error(`[SignInServiceV3] Producer login error for ${email}: ${error.message}`);
          toast({ title: "Erro no Login", description: error.message, variant: "destructive" });
          return { error };
        }
        if (data.user) {
          if (data.user.user_metadata?.role !== 'producer') {
            console.log(`[SignInServiceV3] Updating metadata to 'producer' for ${email}`);
            await updateUserMetadata({ role: 'producer' });
          }
          toast({ title: "Login de Produtor bem-sucedido!", description: "Bem-vindo!" });
          return { error: null, user: data.user, session: data.session, needsPasswordChange: false };
        }
        console.error(`[SignInServiceV3] Producer login for ${email} succeeded but user data is missing.`);
        return { error: new Error("User data not found for producer.") };
      }

      // Branch 2: Company Login (explicitly chosen via ?role=company)
      // AND Branch 3: Default Path (Student, Collaborator, or unspecified role)
      // Both start with a general login attempt.

      console.log(`[SignInServiceV3] Path: ${role === 'company' ? 'Company (explicit)' : 'Default/Student/Collaborator'}. Email: ${email}`);
      const { data: loginAttempt, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        console.error(`[SignInServiceV3] Initial login attempt failed for ${email}. Error: ${loginError.message}`);
        // Company-specific flow for "Invalid login credentials" if role=company
        if (role === 'company' && loginError.message.includes('Invalid login credentials')) {
          console.log(`[SignInServiceV3] Company with role='company' failed initial login. Checking company by email for potential creation/link.`);
          const { companies, companySearchError } = await checkCompanyByEmail(email);

          if (companySearchError) {
            console.error(`[SignInServiceV3] Error checking company by email ${email}: ${companySearchError.message}`);
            toast({ title: "Erro ao verificar empresa", description: companySearchError.message, variant: "destructive" });
            return { error: companySearchError };
          }

          if (companies && companies.length > 0) {
            const company = companies[0];
            console.log(`[SignInServiceV3] Company ${company.name} found. Attempting to create/link auth user.`);
            const { data: createResult, error: createError } = await createCompanyAuthUser(email, company.id);

            if (createError || !createResult?.success) {
              console.error(`[SignInServiceV3] Failed to create/link auth user for company ${company.id}. Error: ${createError?.message}`);
              toast({ title: "Falha ao vincular usuário à empresa", description: createError?.message || "Erro desconhecido na função Edge.", variant: "destructive" });
              return { error: createError || new Error("Failed Edge Function createCompanyAuthUser")};
            }

            console.log(`[SignInServiceV3] Auth user created/linked for ${company.name}. Retrying login.`);
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({ email, password });
            if (retryError) {
              console.error(`[SignInServiceV3] Retry login failed for ${email} after company link. Error: ${retryError.message}`);
              toast({ title: "Erro no Login", description: "Falha ao tentar login após vincular à empresa.", variant: "destructive" });
              return { error: retryError };
            }

            if (retryData.user) {
              console.log(`[SignInServiceV3] Retry login successful for ${email}. Updating metadata to 'company'.`);
              await updateUserMetadata({ role: 'company', company_id: company.id, company_name: company.name });
              toast({ title: "Login de Empresa bem-sucedido!", description: "Bem-vindo! Sua senha precisa ser alterada." });
              return { error: null, user: retryData.user, session: retryData.session, needsPasswordChange: true };
            }
            console.error(`[SignInServiceV3] Retry login for ${email} for company flow succeeded but user data is missing.`);
            return { error: new Error("User data not found on company retry.") };
          } else {
            console.log(`[SignInServiceV3] No company found with email ${email} for role=company flow.`);
            toast({ title: "Empresa não encontrada", description: "Nenhuma empresa cadastrada com este email para login de gestor.", variant: "destructive" });
            return { error: new Error("Company not found for role=company flow.") };
          }
        }
        // General error handling for other login errors (Email not confirmed, etc.)
        if (loginError.message.includes('Email not confirmed')) {
             toast({ title: "Email não confirmado", description: "Verifique seu email para confirmação.", variant: "destructive"});
        } else {
             toast({ title: "Credenciais Inválidas", description: "Email ou senha incorretos.", variant: "destructive"});
        }
        return { error: loginError };
      }

      // Login successful, data.user is available (loginAttempt.user)
      if (loginAttempt.user) {
        const user = loginAttempt.user;
        let userFinalRole = user.user_metadata?.role; // Role from existing metadata
        let needsPwdChange = false;

        console.log(`[SignInServiceV3] Initial login successful for ${user.email}. Current metadata role: ${userFinalRole}. Intended role from URL: ${role}`);

        // Explicit 'company' role from URL (existing company user)
        if (role === 'company') {
          console.log(`[SignInServiceV3] Handling explicit 'company' role for user ${user.id}.`);
          if (userFinalRole !== 'company') {
            console.warn(`[SignInServiceV3] Role mismatch: URL specified 'company', metadata is '${userFinalRole}'. Updating metadata for ${user.id}.`);
            // company_id and company_name should ideally be in metadata if they are a company owner already.
            // If not, this implies a potential data issue or they are being misidentified.
            await updateUserMetadata({
              role: 'company',
              company_id: user.user_metadata?.company_id, // Try to preserve existing if available
              company_name: user.user_metadata?.company_name
            });
            userFinalRole = 'company'; // Reflect update
          }

          // Fetch company record linked to this user's auth_user_id to check 'needs_password_change'
          const { data: companyRecord, error: companyRecordError } = await supabase
            .from('companies')
            .select('id, name, needs_password_change, auth_user_id')
            .eq('auth_user_id', user.id)
            .maybeSingle();

          if (companyRecordError) {
            console.error(`[SignInServiceV3] Error fetching company record for ${user.id} (auth_user_id) to check password status: ${companyRecordError.message}`);
          } else if (companyRecord) {
            if (companyRecord.auth_user_id === user.id && companyRecord.needs_password_change) {
              needsPwdChange = true;
            }
            console.log(`[SignInServiceV3] Company record (owner) for ${user.id} found. Name: ${companyRecord.name}, needs_password_change: ${companyRecord.needs_password_change}`);
          } else {
            console.warn(`[SignInServiceV3] No direct company record found where auth_user_id = ${user.id} to check password status. This user might not be the primary owner or the link is missing.`);
          }

          toast({ title: "Login de Empresa bem-sucedido!", description: needsPwdChange ? "Bem-vindo! Sua senha precisa ser alterada." : "Bem-vindo!" });
          return { error: null, user, session: loginAttempt.session, needsPasswordChange: needsPwdChange };
        }

        // Default path / Collaborator check / Student
        // This path is taken if role is not 'producer' and not 'company' (from URL param)
        console.log(`[SignInServiceV3] Handling default path for user ${user.id}. Current metadata role: ${userFinalRole}`);
        const { collaborator, collaboratorError } = await checkCompanyUser(user.id); // checkCompanyUser uses auth_user_id

        if (!collaboratorError && collaborator) {
          console.log(`[SignInServiceV3] User ${user.id} identified as collaborator for company ID: ${collaborator.company_id}.`);
          userFinalRole = 'collaborator'; // Set role based on collaborator status
          if (user.user_metadata?.role !== 'collaborator' || user.user_metadata?.company_id !== collaborator.company_id) {
            // Fetch company name for metadata
            const {data: linkedCompany, error: linkedCompanyError} = await supabase.from('companies').select('name').eq('id', collaborator.company_id).single();
            await updateUserMetadata({
              role: 'collaborator',
              company_id: collaborator.company_id,
              name: user.user_metadata?.name || collaborator.name,
              company_name: linkedCompany && !linkedCompanyError ? linkedCompany.name : user.user_metadata?.company_name
            });
            console.log(`[SignInServiceV3] Updated metadata for collaborator ${user.id}.`);
          }
          if (collaborator.needs_password_change) {
            needsPwdChange = true;
          }
          toast({ title: "Login de Colaborador bem-sucedido!", description: needsPwdChange ? "Bem-vindo! Sua senha precisa ser alterada." : "Bem-vindo!" });
        } else {
          if (collaboratorError) {
            console.error(`[SignInServiceV3] Error checking collaborator status for ${user.id}: ${collaboratorError.message}`);
          }
          // If not a collaborator (or error), and no specific role was set from metadata (e.g. new user, or old user without role)
          if (!userFinalRole) {
            console.log(`[SignInServiceV3] User ${user.id} is not a collaborator and has no role in metadata. Defaulting to 'student'.`);
            await updateUserMetadata({ role: 'student', name: user.user_metadata?.name || user.email }); // Use email if name not in metadata
            userFinalRole = 'student';
          } else {
            console.log(`[SignInServiceV3] User ${user.id} is not a collaborator. Role remains: '${userFinalRole}' from metadata.`);
          }
          toast({ title: `Login de ${userFinalRole.charAt(0).toUpperCase() + userFinalRole.slice(1)} bem-sucedido!`, description: "Bem-vindo!" });
        }
        
        console.log(`[SignInServiceV3] Sign-in for ${user.email} completed. Final Role: ${userFinalRole}, Needs Password Change: ${needsPwdChange}`);
        return { error: null, user, session: loginAttempt.session, needsPasswordChange: needsPwdChange };
      }
      
      console.error(`[SignInServiceV3] Login attempt for ${email} resulted in no error but also no user object.`);
      return { error: new Error("No user data after login attempt.") };

    } catch (e: any) {
      console.error(`[SignInServiceV3] Critical unhandled error during signIn for ${email}:`, e.message, e.stack);
      toast({ title: "Erro Crítico no Login", description: "Um problema inesperado ocorreu.", variant: "destructive" });
      return { error: { message: e.message, name: "CriticalErrorSignInService" } };
    }
  };
  return { signIn };
};
