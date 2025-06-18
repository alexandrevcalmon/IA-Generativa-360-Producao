
import { supabase } from '@/integrations/supabase/client';
import { checkCompanyUser, updateUserMetadata } from './authUtils';

export const createDefaultSignInService = (toast: any) => {
  const processDefaultSignIn = async (user: any, role?: string) => {
    console.log(`[DefaultSignIn] Processing user ${user.id}. Current metadata role: ${user.user_metadata?.role}. Intended role from URL: ${role}`);

    // Handle explicit 'company' role from URL (existing company user)
    if (role === 'company') {
      console.log(`[DefaultSignIn] Handling explicit 'company' role for user ${user.id}. Verifying company ownership.`);

      const { data: companyRecord, error: companyRecordError } = await supabase
        .from('companies')
        .select('id, name, needs_password_change, auth_user_id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (companyRecordError) {
        console.error(`[DefaultSignIn] Error fetching company record for ${user.id}: ${companyRecordError.message}`);
      }

      if (companyRecord && companyRecord.auth_user_id === user.id) {
        console.log(`[DefaultSignIn] User ${user.id} confirmed as owner of company ${companyRecord.name}`);
        let currentMetaRole = user.user_metadata?.role;
        if (currentMetaRole !== 'company' || user.user_metadata?.company_id !== companyRecord.id || user.user_metadata?.company_name !== companyRecord.name) {
          console.warn(`[DefaultSignIn] Company owner ${user.id} had metadata role '${currentMetaRole}'. Updating to 'company'.`);
          await updateUserMetadata({
            role: 'company',
            company_id: companyRecord.id,
            company_name: companyRecord.name,
            name: user.user_metadata?.name || user.email
          });
        }
        const needsPwdChangeForCompanyOwner = companyRecord.needs_password_change || false;
        toast({ title: "Login de Empresa bem-sucedido!", description: needsPwdChangeForCompanyOwner ? "Bem-vindo! Sua senha precisa ser alterada." : "Bem-vindo!" });
        return { needsPasswordChange: needsPwdChangeForCompanyOwner };
      } else if (!companyRecordError) {
        console.warn(`[DefaultSignIn] User ${user.id} attempted company login but is not linked as an owner.`);
        toast({
          title: "Acesso como Empresa Não Verificado",
          description: "Você será conectado com seu perfil existente.",
          variant: "default",
          duration: 7000,
        });
      }
    }

    // Default path - check for collaborator or student
    let userFinalRole = user.user_metadata?.role;
    let needsPwdChange = false;
    console.log(`[DefaultSignIn] Entering default path for user ${user.id}. Current metadata role: ${userFinalRole}`);

    const { collaborator, collaboratorError } = await checkCompanyUser(user.id);

    if (!collaboratorError && collaborator) {
      console.log(`[DefaultSignIn] User ${user.id} identified as collaborator for company ID: ${collaborator.company_id}.`);
      userFinalRole = 'collaborator';
      if (user.user_metadata?.role !== 'collaborator' || user.user_metadata?.company_id !== collaborator.company_id) {
        await updateUserMetadata({
          role: 'collaborator',
          company_id: collaborator.company_id,
          name: user.user_metadata?.name || collaborator.name,
          company_name: collaborator.company_name || 'Unknown Company'
        });
        console.log(`[DefaultSignIn] Updated metadata for collaborator ${user.id}.`);
      }
      if (collaborator.needs_password_change) {
        needsPwdChange = true;
      }
      toast({ title: "Login de Colaborador bem-sucedido!", description: needsPwdChange ? "Bem-vindo! Sua senha precisa ser alterada." : "Bem-vindo!" });
    } else {
      if (collaboratorError) {
        console.error(`[DefaultSignIn] Error checking collaborator status for ${user.id}: ${collaboratorError.message}`);
      }

      if (userFinalRole === 'company') {
        console.warn(`[DefaultSignIn] User ${user.id} had 'company' role but wasn't verified as owner. Setting to 'student'.`);
        userFinalRole = 'student';
        await updateUserMetadata({ role: 'student', name: user.user_metadata?.name || user.email, company_id: null, company_name: null });
        console.log(`[DefaultSignIn] Role for ${user.id} set to 'student'.`);
      } else if (!userFinalRole) {
        console.log(`[DefaultSignIn] User ${user.id} has no role. Defaulting to 'student'.`);
        await updateUserMetadata({ role: 'student', name: user.user_metadata?.name || user.email });
        userFinalRole = 'student';
      } else {
        console.log(`[DefaultSignIn] User ${user.id} role remains: '${userFinalRole}'.`);
      }

      toast({ title: `Login de ${userFinalRole!.charAt(0).toUpperCase() + userFinalRole!.slice(1)} bem-sucedido!`, description: "Bem-vindo!" });
    }

    return { needsPasswordChange: needsPwdChange };
  };

  return { processDefaultSignIn };
};
