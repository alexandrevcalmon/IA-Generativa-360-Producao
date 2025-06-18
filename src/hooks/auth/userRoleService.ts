
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const createUserRoleService = () => {
  const getUserRole = async (userId: string) => {
    try {
      console.log(`[UserRoleService] Getting role for user: ${userId}`);
      
      // Direct query to profiles table - this is now safe with our new RLS policies
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('[UserRoleService] Error fetching user role from profiles:', profileError);
        
        // Check if it's a company user
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('auth_user_id', userId)
          .single();

        if (!companyError && companyData) {
          console.log('[UserRoleService] User is a company owner');
          return 'company';
        }

        // Check if it's a company collaborator
        const { data: collaboratorData, error: collaboratorError } = await supabase
          .from('company_users')
          .select('id')
          .eq('auth_user_id', userId)
          .single();

        if (!collaboratorError && collaboratorData) {
          console.log('[UserRoleService] User is a company collaborator');
          return 'student';
        }

        console.log('[UserRoleService] Defaulting to student role');
        return 'student';
      }

      const role = profileData?.role || 'student';
      console.log(`[UserRoleService] User role from profiles: ${role}`);
      return role;
    } catch (error) {
      console.error('[UserRoleService] Unexpected error getting user role:', error);
      return 'student';
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      console.log(`[UserRoleService] Updating role for user ${userId} to ${role}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) {
        console.error('[UserRoleService] Error updating user role:', error);
        throw error;
      }

      console.log('[UserRoleService] User role updated successfully');
    } catch (error) {
      console.error('[UserRoleService] Failed to update user role:', error);
      throw error;
    }
  };

  return {
    getUserRole,
    updateUserRole,
  };
};

// New function that was missing - this fetches auxiliary data for role determination
export const fetchUserRoleAuxiliaryData = async (user: User) => {
  console.log(`[fetchUserRoleAuxiliaryData] Fetching auxiliary data for user: ${user.email}`);
  
  try {
    // First try to get role from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profileError && profileData?.role) {
      console.log(`[fetchUserRoleAuxiliaryData] Found role in profiles: ${profileData.role}`);
      return {
        role: profileData.role,
        profileData,
        companyData: null,
        collaboratorData: null
      };
    }

    // Check if user is a company owner
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (!companyError && companyData) {
      console.log('[fetchUserRoleAuxiliaryData] User is a company owner');
      return {
        role: 'company',
        profileData,
        companyData,
        collaboratorData: null
      };
    }

    // Check if user is a company collaborator
    const { data: collaboratorData, error: collaboratorError } = await supabase
      .from('company_users')
      .select(`
        *,
        companies!inner(name)
      `)
      .eq('auth_user_id', user.id)
      .single();

    if (!collaboratorError && collaboratorData) {
      console.log('[fetchUserRoleAuxiliaryData] User is a company collaborator');
      return {
        role: 'collaborator',
        profileData,
        companyData: null,
        collaboratorData: {
          ...collaboratorData,
          company_name: collaboratorData.companies?.name || 'Unknown Company'
        }
      };
    }

    // Default to student role
    console.log('[fetchUserRoleAuxiliaryData] Defaulting to student role');
    return {
      role: 'student',
      profileData,
      companyData: null,
      collaboratorData: null
    };

  } catch (error) {
    console.error('[fetchUserRoleAuxiliaryData] Error fetching auxiliary data:', error);
    return {
      role: 'student',
      profileData: null,
      companyData: null,
      collaboratorData: null
    };
  }
};
