
import { supabase } from "@/integrations/supabase/client";

export interface UserRoleInfo {
  role: 'producer' | 'company' | 'student';
  companyId?: string;
  studentId?: string;
}

export interface UserRoleData {
  role: string;
  needsPasswordChange: boolean;
  companyUserData: any;
}

function inferRoleFromEmail(email: string): 'producer' | 'company' | 'student' {
  // Check for admin patterns that should be producers
  if (email.includes('admin-produtor') || email.includes('producer') || email.includes('produtor')) {
    return 'producer';
  }
  
  // Check for company admin patterns
  if (email.includes('admin-empresa') || email.includes('company')) {
    return 'company';
  }
  
  // Check for student patterns
  if (email.includes('admin-estudante') || email.includes('student') || email.includes('estudante')) {
    return 'student';
  }
  
  // Default fallback
  return 'student';
}

async function getUserProfile(userId: string): Promise<'producer' | 'company' | 'student'> {
  console.log('Getting user profile for:', userId);
  
  try {
    // Direct profile query using the new simplified RLS policies
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (!profileError && profile?.role) {
      console.log('Got role from direct profile query:', profile.role);
      return profile.role as 'producer' | 'company' | 'student';
    }

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    console.log('No profile found or error occurred, profile may need to be created');
    
    // Get user email to infer role as fallback
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      console.error('Error getting user email:', userError);
      return 'student';
    }

    const inferredRole = inferRoleFromEmail(user.email);
    console.log('Inferred role from email as fallback:', inferredRole);
    return inferredRole;
    
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return 'student';
  }
}

export async function getUserRole(userId: string): Promise<UserRoleInfo> {
  console.log('Getting user role for:', userId);
  
  try {
    // Check if user is a company (existing data takes precedence)
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, needs_password_change')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (companyError) {
      console.error('Error fetching company:', companyError);
    }

    if (company) {
      console.log('Found company data:', company);
      return { 
        role: 'company',
        companyId: company.id 
      };
    }

    // Check if user is a collaborator/student (existing data takes precedence)
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('company_users')
      .select('id, company_id, needs_password_change, name, email, companies(name)')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (collaboratorError) {
      console.error('Error fetching collaborator:', collaboratorError);
    }

    if (collaborator) {
      console.log('Found collaborator data:', collaborator);
      return { 
        role: 'student',
        companyId: collaborator.company_id,
        studentId: collaborator.id 
      };
    }

    // Get role from profile or infer it
    const role = await getUserProfile(userId);
    console.log('Using role from profile/inference:', role);
    return { role };
    
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return { role: 'student' };
  }
}

export async function fetchUserRole(userId: string): Promise<UserRoleData> {
  console.log('Fetching user role data for:', userId);
  
  try {
    // Check if user is a company (existing data takes precedence)
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, needs_password_change')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (companyError) {
      console.error('Error fetching company:', companyError);
    }

    if (company) {
      console.log('Found company data, returning company role');
      return { 
        role: 'company',
        needsPasswordChange: company.needs_password_change || false,
        companyUserData: null
      };
    }

    // Check if user is a collaborator/student (existing data takes precedence)
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('company_users')
      .select('id, company_id, needs_password_change, name, email, companies(name)')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (collaboratorError) {
      console.error('Error fetching collaborator:', collaboratorError);
    }

    if (collaborator) {
      console.log('Found collaborator data, returning student role');
      return { 
        role: 'student',
        needsPasswordChange: collaborator.needs_password_change || false,
        companyUserData: collaborator
      };
    }

    // Get role from profile or infer it
    const profileRole = await getUserProfile(userId);
    console.log('Using profile role with no password change required:', profileRole);
    return { 
      role: profileRole,
      needsPasswordChange: false,
      companyUserData: null
    };
    
  } catch (error) {
    console.error('Error in fetchUserRole:', error);
    return { 
      role: 'student',
      needsPasswordChange: false,
      companyUserData: null
    };
  }
}
