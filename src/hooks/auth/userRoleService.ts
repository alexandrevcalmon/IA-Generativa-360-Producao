
import { supabase } from '@/integrations/supabase/client';

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
