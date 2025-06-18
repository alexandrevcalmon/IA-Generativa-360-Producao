
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

export async function getUserRole(userId: string): Promise<UserRoleInfo> {
  console.log('Getting user role for:', userId);
  
  try {
    // First check profiles table for explicit role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    console.log('Profile data:', profile);

    // Check if user is a company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, needs_password_change')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (companyError) {
      console.error('Error fetching company:', companyError);
    }

    console.log('Company data:', company);

    // Check if user is a collaborator/student
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('company_users')
      .select('id, company_id, needs_password_change, name, email, companies(name)')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (collaboratorError) {
      console.error('Error fetching collaborator:', collaboratorError);
    }

    console.log('Collaborator data:', collaborator);

    // Determine role based on data found
    if (profile?.role === 'producer') {
      return { role: 'producer' };
    }
    
    if (company) {
      return { 
        role: 'company',
        companyId: company.id 
      };
    }
    
    if (collaborator) {
      return { 
        role: 'student',
        companyId: collaborator.company_id,
        studentId: collaborator.id 
      };
    }

    // Default fallback - create a student profile if none exists
    console.log('No role found, creating student profile');
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: userId, role: 'student' });

    if (insertError) {
      console.error('Error creating profile:', insertError);
    }

    return { role: 'student' };
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return { role: 'student' };
  }
}

export async function fetchUserRole(userId: string): Promise<UserRoleData> {
  console.log('Fetching user role data for:', userId);
  
  try {
    // First check profiles table for explicit role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Check if user is a company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, needs_password_change')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (companyError) {
      console.error('Error fetching company:', companyError);
    }

    // Check if user is a collaborator/student
    const { data: collaborator, error: collaboratorError } = await supabase
      .from('company_users')
      .select('id, company_id, needs_password_change, name, email, companies(name)')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (collaboratorError) {
      console.error('Error fetching collaborator:', collaboratorError);
    }

    // Determine role and additional data
    if (profile?.role === 'producer') {
      return { 
        role: 'producer',
        needsPasswordChange: false,
        companyUserData: null
      };
    }
    
    if (company) {
      return { 
        role: 'company',
        needsPasswordChange: company.needs_password_change || false,
        companyUserData: null
      };
    }
    
    if (collaborator) {
      return { 
        role: 'student',
        needsPasswordChange: collaborator.needs_password_change || false,
        companyUserData: collaborator
      };
    }

    // Default fallback
    return { 
      role: 'student',
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
