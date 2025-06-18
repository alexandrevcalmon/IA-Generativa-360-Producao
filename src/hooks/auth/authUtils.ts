
import { supabase } from '@/integrations/supabase/client';

export const getRedirectUrl = () => `${window.location.origin}/`;

export const getResetPasswordRedirectUrl = () => `${window.location.origin}/auth?reset=true`;

export const checkCompanyUser = async (userId: string) => {
  const { data: collaborator, error: collaboratorError } = await supabase
    .from('company_users')
    .select(`
      id, 
      needs_password_change, 
      company_id, 
      name,
      companies!inner(name)
    `)
    .eq('auth_user_id', userId)
    .maybeSingle();
  
  // Transform the data to include company_name at the root level
  const transformedCollaborator = collaborator ? {
    ...collaborator,
    company_name: collaborator.companies?.name || 'Unknown Company'
  } : null;
  
  return { collaborator: transformedCollaborator, collaboratorError };
};

export const checkCompanyByEmail = async (email: string) => {
  const { data: companies, error: companySearchError } = await supabase
    .from('companies')
    .select('id, contact_email, auth_user_id, name')
    .eq('contact_email', email);
  
  return { companies, companySearchError };
};

export const updateUserMetadata = async (metadata: Record<string, any>) => {
  return await supabase.auth.updateUser({
    data: metadata
  });
};

export const createCompanyAuthUser = async (email: string, companyId: string) => {
  return await supabase.functions.invoke(
    'create-company-auth-user',
    {
      body: { email, companyId }
    }
  );
};
