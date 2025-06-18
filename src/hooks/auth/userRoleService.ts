import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// This interface will hold the auxiliary data fetched based on the role
export interface UserRoleAuxiliaryData {
  role: string; // Role from user_metadata
  companyData?: any; // For company owners or collaborators
  collaboratorData?: any; // For collaborators (which might include nested companyData)
  profileData?: any; // General profile data from public.profiles
}

/**
 * Fetches auxiliary data based on the user's role stored in user_metadata.
 * The user's role itself is taken directly from user.user_metadata.role.
 * This function is responsible for getting related data like company name,
 * collaborator details, etc.
 *
 * @param user The authenticated Supabase User object.
 * @returns Promise<UserRoleAuxiliaryData>
 */
export const fetchUserRoleAuxiliaryData = async (user: User): Promise<UserRoleAuxiliaryData> => {
  // Role is determined from user_metadata. Default to 'student' if not present.
  const role = user.user_metadata?.role || 'student';
  let companyData = null;
  let collaboratorData = null;
  let profileData = null;

  console.log(`[fetchUserRoleAuxiliaryData] User ID: ${user.id}, Role from metadata: ${role}`);

  try {
    // Fetch general profile data from public.profiles
    // This table should be kept in sync by the database trigger
    const { data: fetchedProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*') // Select required fields e.g., name, email, avatar_url
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error(`[fetchUserRoleAuxiliaryData] Error fetching profile data for user ${user.id}:`, profileError.message);
    } else {
      profileData = fetchedProfile;
      console.log(`[fetchUserRoleAuxiliaryData] Fetched profile data for user ${user.id}:`, profileData);
      // Potentially verify if profileData.role matches user.user_metadata.role as a sanity check
      if (profileData?.role !== role) {
        console.warn(`[fetchUserRoleAuxiliaryData] Mismatch between metadata role (${role}) and profile table role (${profileData?.role}) for user ${user.id}. Metadata role is primary.`);
        // The trigger should ideally prevent this, but good to log if observed.
      }
    }

    if (role === 'company') {
      console.log(`[fetchUserRoleAuxiliaryData] User is a 'company' role. Fetching company details where auth_user_id = ${user.id}`);
      const { data: companyDetails, error: companyError } = await supabase
        .from('companies')
        .select('*') // Adjust selection as needed
        .eq('auth_user_id', user.id)
        .single();

      if (companyError) {
        console.error(`[fetchUserRoleAuxiliaryData] Error fetching company details for owner ${user.id}:`, companyError.message);
      } else {
        companyData = companyDetails;
        console.log(`[fetchUserRoleAuxiliaryData] Fetched company details for owner ${user.id}:`, companyData);
      }
    } else if (role === 'collaborator') {
      console.log(`[fetchUserRoleAuxiliaryData] User is a 'collaborator' role. Fetching collaborator details for auth_user_id = ${user.id}`);
      const { data: collabDetails, error: collabError } = await supabase
        .from('company_users')
        .select('*, companies(*)') // Fetch collaborator and nested company details
        .eq('auth_user_id', user.id)
        .single();

      if (collabError) {
        console.error(`[fetchUserRoleAuxiliaryData] Error fetching collaborator details for user ${user.id}:`, collabError.message);
      } else {
        collaboratorData = collabDetails;
        // The company data is nested within the collaborator details if the join is successful
        companyData = collabDetails?.companies;
        console.log(`[fetchUserRoleAuxiliaryData] Fetched collaborator details for user ${user.id}:`, collaboratorData);
        if (companyData) {
          console.log(`[fetchUserRoleAuxiliaryData] Nested company details for collaborator ${user.id}:`, companyData);
        }
      }
    }

    return {
      role, // The role from user_metadata
      companyData,
      collaboratorData,
      profileData,
    };

  } catch (error: any) {
    console.error(`[fetchUserRoleAuxiliaryData] Unexpected error for user ${user.id}:`, error.message);
    // Fallback to returning the role from metadata and null for other data
    return {
      role,
      companyData: null,
      collaboratorData: null,
      profileData: null,
    };
  }
};

// The old fetchUserRole function is now replaced.
// AuthProvider will need to be updated to use the User object's metadata for role
// and then call this service to get additional data.
// The needsPasswordChange logic is now primarily handled in signInService.ts
// and its state managed in AuthProvider.tsx. This service no longer returns it.
// The old UserRoleData type might need to be adjusted or replaced by UserRoleAuxiliaryData
// in AuthContextType and other places. For now, this file only defines and uses UserRoleAuxiliaryData.
// The existing UserRoleData in types.ts was:
// export interface UserRoleData {
//   role: string | null;
//   needsPasswordChange: boolean;
//   companyUserData: any;
// }
// This will need to be reconciled in a later step, likely by updating AuthContextType and AuthProvider state.
// For this subtask, the focus is on refactoring this service.
