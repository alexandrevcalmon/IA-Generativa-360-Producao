// src/hooks/auth/userRoleService.ts
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserRoleAuxiliaryData {
  role: string | null; // Changed from string to string | null to match usage
  companyData?: any;
  collaboratorData?: any;
  profileData?: any;
}

export const fetchUserRoleAuxiliaryData = async (user: User): Promise<UserRoleAuxiliaryData> => {
  // Role is determined from user_metadata. Default to 'student' if not present.
  const baseRole = user.user_metadata?.role || 'student';
  let companyData = null;
  let collaboratorData = null;
  let profileData = null; // Renamed from 'profile' to 'profileData' for consistency

  console.log(`[fetchUserRoleAuxiliaryDataV2] User ID: ${user.id}, Role from metadata: ${baseRole}`);

  try {
    if (baseRole === 'company') {
      console.log(`[fetchUserRoleAuxiliaryDataV2] User is a '${baseRole}'. Fetching company details where auth_user_id = ${user.id}`);
      const { data: companyResult, error: companyError } = await supabase
        .from('companies')
        .select('*') // Adjust selection as needed
        .eq('auth_user_id', user.id)
        .maybeSingle(); // MODIFIED to maybeSingle()

      if (companyError) {
        console.error(`[fetchUserRoleAuxiliaryDataV2] Error fetching company details for owner ${user.id}:`, companyError.message);
        // A 406 error here would mean PostgREST is trying to return a single object but found multiple,
        // or the Accept header is not allowing the response type. maybeSingle() helps with 0 or 1.
        // If it's about Accept header, that's a deeper Supabase client/config issue.
      } else if (companyResult) {
        companyData = companyResult;
        console.log(`[fetchUserRoleAuxiliaryDataV2] Fetched company details for owner ${user.id}:`, companyData.name);
      } else {
        console.warn(`[fetchUserRoleAuxiliaryDataV2] No company found for owner ${user.id} where auth_user_id matches.`);
      }
    } else if (baseRole === 'collaborator') {
      console.log(`[fetchUserRoleAuxiliaryDataV2] User is a '${baseRole}'. Fetching collaborator details for auth_user_id = ${user.id}`);
      const { data: collabResult, error: collabError } = await supabase
        .from('company_users')
        .select('*, companies(*)') // companies(*) should fetch the related company
        .eq('auth_user_id', user.id)
        .maybeSingle(); // MODIFIED to maybeSingle()

      if (collabError) {
        console.error(`[fetchUserRoleAuxiliaryDataV2] Error fetching collaborator details for user ${user.id}:`, collabError.message);
      } else if (collabResult) {
        collaboratorData = collabResult;
        companyData = collabResult.companies; // This is the nested company data
        if (companyData) {
          console.log(`[fetchUserRoleAuxiliaryDataV2] Fetched collaborator details for user ${user.id}, company: ${companyData.name}`);
        } else {
          // This can happen if companies(*) returns null due to RLS or if the company_id is invalid
          console.warn(`[fetchUserRoleAuxiliaryDataV2] Collaborator ${user.id} found, but linked company data via companies(*) is missing. Company ID from company_users: ${collabResult.company_id}`);
        }
      } else {
        console.warn(`[fetchUserRoleAuxiliaryDataV2] No collaborator record found for user ${user.id}.`);
      }
    }

    // Fetch general profile data from public.profiles
    const { data: fetchedProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*') // Select required fields e.g., name, email, avatar_url
      .eq('id', user.id)
      .maybeSingle(); // Changed to maybeSingle for safety, though trigger should ensure one.

    if (profileError) {
      console.error(`[fetchUserRoleAuxiliaryDataV2] Error fetching profile data for user ${user.id}:`, profileError.message);
    } else if (fetchedProfile) {
      profileData = fetchedProfile;
      // Log if there's still a mismatch for observation.
      if (profileData.role !== baseRole) {
          console.warn(`[fetchUserRoleAuxiliaryDataV2] Mismatch between metadata role (${baseRole}) and profile table role (${profileData.role}) for user ${user.id}. Metadata role is primary.`);
      }
    } else {
      console.warn(`[fetchUserRoleAuxiliaryDataV2] No profile record found for user ${user.id}. This is unexpected if the trigger is working.`);
    }

    return {
      role: baseRole,
      companyData,
      collaboratorData,
      profileData,
    };

  } catch (error: any) {
    console.error(`[fetchUserRoleAuxiliaryDataV2] Unexpected error for user ${user.id}:`, error.message);
    return {
      role: baseRole, // Return baseRole even in case of other errors
      companyData: null,
      collaboratorData: null,
      profileData: null,
    };
  }
};
