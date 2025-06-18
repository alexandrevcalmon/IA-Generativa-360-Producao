
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

async function ensureUserProfile(userId: string, email: string): Promise<'producer' | 'company' | 'student'> {
  console.log('Ensuring user profile for:', { userId, email });
  
  try {
    // First check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking existing profile:', profileError);
      // Don't throw here, continue with profile creation
    }

    if (existingProfile?.role) {
      console.log('Found existing profile with role:', existingProfile.role);
      return existingProfile.role as 'producer' | 'company' | 'student';
    }

    // Infer role from email
    const inferredRole = inferRoleFromEmail(email);
    console.log('Inferred role from email:', inferredRole);

    // Create profile with inferred role
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({ 
        id: userId, 
        role: inferredRole 
      })
      .select('role')
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      // Even if insert failed, return inferred role as fallback
      return inferredRole;
    }

    console.log('Successfully created profile with role:', newProfile.role);
    return newProfile.role as 'producer' | 'company' | 'student';
  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
    // Fallback to email inference
    return inferRoleFromEmail(email);
  }
}

export async function getUserRole(userId: string): Promise<UserRoleInfo> {
  console.log('Getting user role for:', userId);
  
  try {
    // Get user email from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      console.error('Error getting user or no email:', userError);
      return { role: 'student' };
    }

    console.log('User email:', user.email);

    // Ensure profile exists and get role
    const role = await ensureUserProfile(userId, user.email);

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

    // Return the role from profile/inference
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
    // Get user email from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      console.error('Error getting user or no email:', userError);
      return { 
        role: 'student',
        needsPasswordChange: false,
        companyUserData: null
      };
    }

    console.log('User email:', user.email);

    // Ensure profile exists and get role
    const profileRole = await ensureUserProfile(userId, user.email);

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

    // Use role from profile/inference with no password change required for fresh profiles
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
