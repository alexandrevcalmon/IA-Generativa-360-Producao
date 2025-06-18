
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
  console.log(`[fetchUserRoleAuxiliaryData] Starting role determination for user: ${user.id}`);
  
  let companyData = null;
  let collaboratorData = null;
  let profileData = null;
  let finalRole = 'student'; // Default role

  try {
    // First, ensure the user has a profile using the new safe function
    const { error: ensureError } = await supabase.rpc('ensure_user_profile', {
      user_id: user.id,
      user_role: user.user_metadata?.role || 'student'
    });

    if (ensureError) {
      console.error(`[fetchUserRoleAuxiliaryData] Error ensuring profile:`, ensureError.message);
    }

    // Now fetch the profile data
    const { data: fetchedProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error(`[fetchUserRoleAuxiliaryData] Error fetching profile:`, profileError.message);
      // Create profile manually if RPC failed
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ 
          id: user.id, 
          role: user.user_metadata?.role || 'student' 
        })
        .select()
        .maybeSingle();
      
      if (createError) {
        console.error(`[fetchUserRoleAuxiliaryData] Error creating profile:`, createError.message);
      } else {
        profileData = newProfile;
      }
    } else {
      profileData = fetchedProfile;
    }

    // Use profile role if available, otherwise use metadata
    if (profileData?.role) {
      finalRole = profileData.role;
      console.log(`[fetchUserRoleAuxiliaryData] Role from profile: ${finalRole}`);
    } else {
      finalRole = user.user_metadata?.role || 'student';
      console.log(`[fetchUserRoleAuxiliaryData] Role from metadata: ${finalRole}`);
    }

    // Check if user is a collaborator
    const { data: collabResult, error: collabError } = await supabase
      .from('company_users')
      .select(`
        *, 
        companies:company_id(*)
      `)
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

    // Update profile role if it has changed
    if (profileData && profileData.role !== finalRole) {
      console.log(`[fetchUserRoleAuxiliaryData] Updating profile role from ${profileData.role} to ${finalRole}`);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: finalRole })
        .eq('id', user.id);
      
      if (updateError) {
        console.error(`[fetchUserRoleAuxiliaryData] Error updating profile role:`, updateError.message);
      } else {
        // Update local profile data
        profileData = { ...profileData, role: finalRole };
      }
    }

    console.log(`[fetchUserRoleAuxiliaryData] Final role determination: ${finalRole}`, {
      hasCompanyData: !!companyData,
      hasCollaboratorData: !!collaboratorData,
      hasProfileData: !!profileData
    });

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
