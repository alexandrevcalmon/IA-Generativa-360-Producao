
// src/hooks/auth/userRoleService.ts
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserRoleAuxiliaryData {
  role: string | null;
  companyData?: any;
  collaboratorData?: any;
  profileData?: any;
}

export const fetchUserRoleAuxiliaryData = async (user: User): Promise<UserRoleAuxiliaryData> => {
  // First, check if user is a collaborator in company_users table
  console.log(`[fetchUserRoleAuxiliaryData] Checking user roles for: ${user.id}`);
  
  let companyData = null;
  let collaboratorData = null;
  let profileData = null;
  let finalRole = user.user_metadata?.role || 'student';

  try {
    // Check if user is a collaborator first
    const { data: collabResult, error: collabError } = await supabase
      .from('company_users')
      .select('*, companies(*)')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (collabError) {
      console.error(`[fetchUserRoleAuxiliaryData] Error checking collaborator status:`, collabError.message);
    } else if (collabResult) {
      console.log(`[fetchUserRoleAuxiliaryData] User is a collaborator`);
      finalRole = 'collaborator';
      collaboratorData = collabResult;
      companyData = collabResult.companies;
    }

    // If not a collaborator, check if user is a company owner
    if (!collabResult) {
      const { data: companyResult, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (companyError) {
        console.error(`[fetchUserRoleAuxiliaryData] Error checking company ownership:`, companyError.message);
      } else if (companyResult) {
        console.log(`[fetchUserRoleAuxiliaryData] User is a company owner`);
        finalRole = 'company';
        companyData = companyResult;
      }
    }

    // Fetch profile data
    const { data: fetchedProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error(`[fetchUserRoleAuxiliaryData] Error fetching profile:`, profileError.message);
    } else if (fetchedProfile) {
      profileData = fetchedProfile;
      
      // Update profile role if it doesn't match what we determined
      if (fetchedProfile.role !== finalRole) {
        console.log(`[fetchUserRoleAuxiliaryData] Updating profile role from ${fetchedProfile.role} to ${finalRole}`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: finalRole })
          .eq('id', user.id);
        
        if (updateError) {
          console.error(`[fetchUserRoleAuxiliaryData] Error updating profile role:`, updateError.message);
        }
      }
    } else {
      // Create profile if it doesn't exist
      console.log(`[fetchUserRoleAuxiliaryData] Creating new profile with role: ${finalRole}`);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ id: user.id, role: finalRole })
        .select()
        .single();
      
      if (createError) {
        console.error(`[fetchUserRoleAuxiliaryData] Error creating profile:`, createError.message);
      } else {
        profileData = newProfile;
      }
    }

    return {
      role: finalRole,
      companyData,
      collaboratorData,
      profileData,
    };

  } catch (error: any) {
    console.error(`[fetchUserRoleAuxiliaryData] Unexpected error for user ${user.id}:`, error.message);
    return {
      role: finalRole,
      companyData: null,
      collaboratorData: null,
      profileData: null,
    };
  }
};
