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
      // V4: Refined handling for role=company for existing users.
      console.log(`[SignInServiceV4] Attempting sign-in. Email: ${email}, Intended Role: ${role}`);

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
        const user = loginAttempt.user;
        // userFinalRole and needsPwdChange will be determined by the specific path taken below.

        console.log(`[SignInServiceV4] Initial login successful for ${user.email}. Current metadata role: ${user.user_metadata?.role}. Intended role from URL: ${role}`);

        // Explicit 'company' role from URL (existing company user)
        if (role === 'company') {
          console.log(`[SignInServiceV4] Handling explicit 'company' role for user ${user.id}. Verifying company ownership.`);

          const { data: companyRecord, error: companyRecordError } = await supabase
            .from('companies')
            .select('id, name, needs_password_change, auth_user_id')
            .eq('auth_user_id', user.id)
            .maybeSingle();

          if (companyRecordError) {
            console.error(`[SignInServiceV4] Error fetching company record for ${user.id} (auth_user_id) to verify ownership: ${companyRecordError.message}. Proceeding with default role handling.`);
            // Fall through to default handling by not returning here.
          }

          if (companyRecord && companyRecord.auth_user_id === user.id) {
            // User IS a legitimate company owner.
            console.log(`[SignInServiceV4] User ${user.id} confirmed as owner of company ${companyRecord.name} (ID: ${companyRecord.id}).`);
            let currentMetaRole = user.user_metadata?.role;
            if (currentMetaRole !== 'company' || user.user_metadata?.company_id !== companyRecord.id || user.user_metadata?.company_name !== companyRecord.name) {
              console.warn(`[SignInServiceV4] Company owner ${user.id} had metadata role '${currentMetaRole}' or mismatched company details. Updating to 'company' with correct details.`);
              await updateUserMetadata({
                role: 'company',
                company_id: companyRecord.id,
                company_name: companyRecord.name,
                name: user.user_metadata?.name || user.email // Preserve existing name from metadata or default to email
              });
            }
            const needsPwdChangeForCompanyOwner = companyRecord.needs_password_change || false;
            toast({ title: "Login de Empresa bem-sucedido!", description: needsPwdChangeForCompanyOwner ? "Bem-vindo! Sua senha precisa ser alterada." : "Bem-vindo!" });
            return { error: null, user, session: loginAttempt.session, needsPasswordChange: needsPwdChangeForCompanyOwner };
          } else if (!companyRecordError) { // Only show this if there wasn't a DB error, meaning user is definitively not linked.
            // User is NOT a company owner, despite ?role=company.
            console.warn(`[SignInServiceV4] User ${user.id} attempted company login via URL but is not linked as an owner in 'companies' table. Proceeding with actual role determination.`);
            toast({
              id: 'non-owner-company-login-toast-id', // Added ID to potentially prevent duplicate generic toasts
              title: "Acesso como Empresa Não Verificado",
              description: "Você será conectado com seu perfil existente.",
              variant: "info",
              duration: 7000, // Longer duration for info toast
            });
            // Fall through to default/collaborator/student handling.
            // Metadata role will NOT be changed to 'company' here.
          }
        } // End of explicit 'company' role handling from URL

        // DEFAULT PATH / Collaborator check / Student
        // This path is taken if:
        // 1. role was not 'producer' AND
        // 2. role was not 'company' (from URL) OR
        // 3. role was 'company' (from URL) but user was not verified as a company owner (or DB error occurred during check).
        let userFinalRole = user.user_metadata?.role; // Re-evaluate userFinalRole based on current metadata
        let needsPwdChange = false;
        console.log(`[SignInServiceV4] Entering default/collaborator/student path for user ${user.id}. Current metadata role: ${userFinalRole}`);

        const { collaborator, collaboratorError } = await checkCompanyUser(user.id);

        if (!collaboratorError && collaborator) {
          console.log(`[SignInServiceV4] User ${user.id} identified as collaborator for company ID: ${collaborator.company_id}.`);
          userFinalRole = 'collaborator';
          if (user.user_metadata?.role !== 'collaborator' || user.user_metadata?.company_id !== collaborator.company_id || user.user_metadata?.company_name !== collaborator.companies?.name) {
            await updateUserMetadata({
              role: 'collaborator',
              company_id: collaborator.company_id,
              name: user.user_metadata?.name || collaborator.name,
              company_name: collaborator.companies?.name // Assumes companies a nested object with name
            });
            console.log(`[SignInServiceV4] Updated metadata for collaborator ${user.id}.`);
          }
          if (collaborator.needs_password_change) {
            needsPwdChange = true;
          }
          // Avoid double toast if info toast about redirection was just shown
          if (!toast.isActive?.('non-owner-company-login-toast-id')) {
             toast({ title: "Login de Colaborador bem-sucedido!", description: needsPwdChange ? "Bem-vindo! Sua senha precisa ser alterada." : "Bem-vindo!" });
          }
        } else {
          if (collaboratorError) {
            console.error(`[SignInServiceV4] Error checking collaborator status for ${user.id}: ${collaboratorError.message}`);
          }
          // If not a collaborator, and no specific role was set from metadata (e.g. new user, or old user without role)
          // Or if user.user_metadata.role was 'company' but they weren't verified as owner, it will fall here.
          // We should ensure that if user.user_metadata.role is 'company' but they are not an owner, it gets reset to 'student' or their actual role.
          // However, the current logic defaults to 'student' only if !userFinalRole.
          // If userFinalRole is 'company' (but not owner), it will currently stay 'company'. This needs refinement.

          if (userFinalRole === 'company') { // They had 'company' in metadata but weren't verified as owner
             console.warn(`[SignInServiceV4] User ${user.id} had 'company' role in metadata but was not verified as owner. Re-evaluating role.`);
             // At this point, they are not an owner, not a collaborator. Default to student.
             userFinalRole = 'student';
             await updateUserMetadata({ role: 'student', name: user.user_metadata?.name || user.email, company_id: null, company_name: null }); // Clear company info
             console.log(`[SignInServiceV4] Role for ${user.id} set to 'student' as company ownership not verified.`);
          } else if (!userFinalRole) { // No role at all
            console.log(`[SignInServiceV4] User ${user.id} is not a collaborator and has no role in metadata. Defaulting to 'student'.`);
            await updateUserMetadata({ role: 'student', name: user.user_metadata?.name || user.email });
            userFinalRole = 'student';
          } else { // Existing role (e.g. student, or already collaborator and confirmed above)
            console.log(`[SignInServiceV4] User ${user.id} is not a (newly identified) collaborator. Role remains: '${userFinalRole}' from metadata.`);
          }

          if (!toast.isActive?.('non-owner-company-login-toast-id')) {
            toast({ title: `Login de ${userFinalRole!.charAt(0).toUpperCase() + userFinalRole!.slice(1)} bem-sucedido!`, description: "Bem-vindo!" });
          }
        }
        
        console.log(`[SignInServiceV4] Sign-in for ${user.email} completed. Final Role: ${userFinalRole}, Needs Password Change: ${needsPwdChange}`);
        return { error: null, user, session: loginAttempt.session, needsPasswordChange: needsPwdChange };
      }
      
      console.error(`[SignInServiceV4] Login attempt for ${email} resulted in no error but also no user object.`);
      return { error: new Error("No user data after login attempt.") };

    } catch (e: any) {
      console.error(`[SignInServiceV4] Critical unhandled error during signIn for ${email}:`, e.message, e.stack);
      toast({ title: "Erro Crítico no Login", description: "Um problema inesperado ocorreu.", variant: "destructive" });
      return { error: { message: e.message, name: "CriticalErrorSignInService" } };
    }
  };
  return { signIn };
};
