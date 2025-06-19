
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const createUserRoleService = () => {
  const getUserRole = async (userId: string) => {
    try {
      console.log(`[UserRoleService] Getting role for user: ${userId}`);
      
      // Use the new enhanced function that checks producers first
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role_enhanced', {
        user_id: userId
      });

      if (!roleError && roleData) {
        console.log(`[UserRoleService] Enhanced role check result: ${roleData}`);
        return roleData;
      }

      // Fallback to original logic if function fails
      console.log(`[UserRoleService] Falling back to original role logic`);
      
      // First check if user is a producer using the new table
      const { data: producerCheck, error: producerError } = await supabase.rpc('is_current_user_producer_new');

      if (!producerError && producerCheck) {
        console.log(`[UserRoleService] User is a producer`);
        return 'producer';
      }

      // Then check if user is a company owner
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name')
        .eq('auth_user_id', userId)
        .single();

      if (!companyError && companyData) {
        console.log(`[UserRoleService] User is a company owner: ${companyData.name}`);
        return 'company';
      }

      // Then check profiles table for explicit role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!profileError && profileData?.role) {
        console.log(`[UserRoleService] User role from profiles: ${profileData.role}`);
        
        // If profiles says student but user is company owner, override to company
        if (profileData.role === 'student' && companyData) {
          console.log(`[UserRoleService] Overriding student role to company for company owner`);
          return 'company';
        }
        
        return profileData.role;
      }

      // Check if it's a company collaborator
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('company_users')
        .select('id')
        .eq('auth_user_id', userId)
        .single();

      if (!collaboratorError && collaboratorData) {
        console.log('[UserRoleService] User is a company collaborator');
        return 'collaborator';
      }

      console.log('[UserRoleService] Defaulting to student role');
      return 'student';
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
        .upsert({ id: userId, role });

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

// Enhanced function that prioritizes producer check
export const fetchUserRoleAuxiliaryData = async (user: User) => {
  console.log(`[fetchUserRoleAuxiliaryData] Fetching auxiliary data for user: ${user.email}`);
  
  try {
    // First priority: Check if user is a producer using the new function
    const { data: producerCheck, error: producerError } = await supabase.rpc('is_current_user_producer_new');

    if (!producerError && producerCheck) {
      console.log('[fetchUserRoleAuxiliaryData] User is a producer');
      
      // Get producer data for additional info
      const { data: producerData, error: producerDataError } = await supabase
        .from('producers')
        .select('*')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single();
      
      // Update profiles table to ensure consistency
      await supabase
        .from('profiles')
        .upsert({ id: user.id, role: 'producer' });
      
      return {
        role: 'producer',
        profileData: { role: 'producer' },
        companyData: null,
        collaboratorData: null,
        producerData: producerDataError ? null : producerData
      };
    }

    // Second priority: Check if user is a company owner
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (!companyError && companyData) {
      console.log('[fetchUserRoleAuxiliaryData] User is a company owner');
      
      // Update profiles table to ensure consistency
      await supabase
        .from('profiles')
        .upsert({ id: user.id, role: 'company' });
      
      return {
        role: 'company',
        profileData: { role: 'company' },
        companyData,
        collaboratorData: null,
        producerData: null
      };
    }

    // Third priority: Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profileError && profileData?.role && profileData.role !== 'student') {
      console.log(`[fetchUserRoleAuxiliaryData] Found role in profiles: ${profileData.role}`);
      return {
        role: profileData.role,
        profileData,
        companyData: null,
        collaboratorData: null,
        producerData: null
      };
    }

    // Fourth priority: Check if user is a company collaborator
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
        },
        producerData: null
      };
    }

    // Default to student role
    console.log('[fetchUserRoleAuxiliaryData] Defaulting to student role');
    return {
      role: 'student',
      profileData,
      companyData: null,
      collaboratorData: null,
      producerData: null
    };

  } catch (error) {
    console.error('[fetchUserRoleAuxiliaryData] Error fetching auxiliary data:', error);
    return {
      role: 'student',
      profileData: null,
      companyData: null,
      collaboratorData: null,
      producerData: null
    };
  }
};
