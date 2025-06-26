
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createProducerRoleService } from './producerRoleService';
import { createRoleManagementService } from './roleManagementService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const DEFAULT_TIMEOUT = 7000; // 7 seconds

export const createUserAuxiliaryDataService = () => {
  const producerRoleService = createProducerRoleService();
  const roleManagementService = createRoleManagementService();

  const fetchUserRoleAuxiliaryData = async (user: User) => {
    console.log(`[UserAuxiliaryDataService] Fetching auxiliary data for user: ${user.email}`);
    let profileDataFromProfilesTable: { role: string } | null = null; // To store profile data if fetched

    try {
      // First priority: Check if user is a producer
      try {
        const isProducer = await withTimeout(
          producerRoleService.isUserProducer(user.id),
          DEFAULT_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout checking producer status"
        );

        if (isProducer) {
          console.log('[UserAuxiliaryDataService] User is a producer');
          const producerData = await withTimeout(
            producerRoleService.getProducerData(user.id),
            DEFAULT_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout fetching producer data"
          );
          await withTimeout(
            roleManagementService.ensureProfileConsistency(user.id, 'producer'),
            DEFAULT_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout ensuring producer profile consistency"
          );
          return {
            role: 'producer',
            profileData: { role: 'producer' },
            companyData: null,
            collaboratorData: null,
            producerData,
            needsPasswordChange: false,
          };
        }
      } catch (error) {
        console.error('[UserAuxiliaryDataService] Error or timeout in producer check:', error instanceof TimeoutError ? error.message : error);
        // Continue to next checks
      }

      // Second priority: Check if user is a company owner
      try {
        console.log('[UserAuxiliaryDataService] Checking if user is a company owner...');
        const { data: companyData, error: companyError } = await withTimeout(
          supabase
            .from('companies')
            .select('*, needs_password_change')
            .eq('auth_user_id', user.id)
            .maybeSingle(),
          DEFAULT_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout fetching company data"
        );

        if (companyError) {
          console.error('[UserAuxiliaryDataService] Error querying companies table:', companyError);
        } else if (companyData) {
          console.log('[UserAuxiliaryDataService] User is a company owner with data:', {
            companyId: companyData.id,
            companyName: companyData.name,
            needsPasswordChange: companyData.needs_password_change,
          });
          await withTimeout(
            roleManagementService.ensureProfileConsistency(user.id, 'company'),
            DEFAULT_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout ensuring company profile consistency"
          );
          return {
            role: 'company',
            profileData: { role: 'company' },
            companyData,
            collaboratorData: null,
            producerData: null,
            needsPasswordChange: companyData.needs_password_change || false,
          };
        } else {
          console.log('[UserAuxiliaryDataService] No company data found for user');
        }
      } catch (error) {
        console.error('[UserAuxiliaryDataService] Error or timeout in company check:', error instanceof TimeoutError ? error.message : error);
      }

      // Third priority: Check profiles table (and store result for collaborator check)
      try {
        console.log('[UserAuxiliaryDataService] Checking profiles table...');
        const { data: fetchedProfileData, error: profileError } = await withTimeout(
          supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle(),
          DEFAULT_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout fetching profile data"
        );

        profileDataFromProfilesTable = fetchedProfileData; // Store for later use

        if (profileError) {
          console.error('[UserAuxiliaryDataService] Error querying profiles table:', profileError);
        } else if (fetchedProfileData?.role && fetchedProfileData.role !== 'student' && fetchedProfileData.role !== 'collaborator') { // Avoid returning early if role is collaborator
          console.log(`[UserAuxiliaryDataService] Found role in profiles: ${fetchedProfileData.role}`);
          // We don't ensureProfileConsistency here as it might be redundant if we find a more specific role later or default to student
          return {
            role: fetchedProfileData.role,
            profileData: fetchedProfileData,
            companyData: null,
            collaboratorData: null,
            producerData: null,
            needsPasswordChange: false,
          };
        }
      } catch (error) {
        console.error('[UserAuxiliaryDataService] Error or timeout in profiles table check:', error instanceof TimeoutError ? error.message : error);
      }

      // Fourth priority: Check if user is a company collaborator
      try {
        console.log('[UserAuxiliaryDataService] Checking if user is a company collaborator...');
        const { data: collaboratorData, error: collaboratorError } = await withTimeout(
          supabase
            .from('company_users')
            .select('*, needs_password_change, companies!inner(name)')
            .eq('auth_user_id', user.id)
            .maybeSingle(),
          DEFAULT_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout fetching collaborator data"
        );

        if (collaboratorError) {
          console.error('[UserAuxiliaryDataService] Error querying company_users table:', collaboratorError);
        } else if (collaboratorData) {
          console.log('[UserAuxiliaryDataService] User is a company collaborator with data:', {
            collaboratorId: collaboratorData.id,
            companyName: collaboratorData.companies?.name,
            needsPasswordChange: collaboratorData.needs_password_change,
          });
           // Ensure profile consistency for collaborator
          await withTimeout(
            roleManagementService.ensureProfileConsistency(user.id, 'collaborator'),
            DEFAULT_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout ensuring collaborator profile consistency"
          );
          return {
            role: 'collaborator',
            profileData: profileDataFromProfilesTable || { role: 'collaborator' }, // Use fetched profile data if available
            companyData: null,
            collaboratorData: {
              ...collaboratorData,
              company_name: collaboratorData.companies?.name || 'Unknown Company',
            },
            producerData: null,
            needsPasswordChange: collaboratorData.needs_password_change || false,
          };
        } else {
          console.log('[UserAuxiliaryDataService] No collaborator data found for user');
        }
      } catch (error) {
        console.error('[UserAuxiliaryDataService] Error or timeout in collaborator check:', error instanceof TimeoutError ? error.message : error);
      }

      // Default to student role - ensure profile exists
      console.log('[UserAuxiliaryDataService] Defaulting to student role and ensuring profile exists...');
      try {
        await withTimeout(
          roleManagementService.ensureProfileConsistency(user.id, 'student'),
          DEFAULT_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout ensuring student profile consistency"
        );
      } catch (error) {
         console.error('[UserAuxiliaryDataService] Error or timeout ensuring student profile consistency (defaulting):', error instanceof TimeoutError ? error.message : error);
      }
      
      return {
        role: 'student',
        profileData: profileDataFromProfilesTable || { role: 'student' }, // Use fetched profile data if available, otherwise default
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };

    } catch (criticalError) { // This outer catch should ideally not be hit if individual steps handle their errors.
      console.error('[UserAuxiliaryDataService] Unexpected critical error fetching auxiliary data:', criticalError);
      // Fallback to ensuring student profile consistency even in unexpected critical error scenarios
      try {
        await withTimeout(
            roleManagementService.ensureProfileConsistency(user.id, 'student'),
            DEFAULT_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout ensuring student profile consistency on critical error"
          );
      } catch (profileError) {
        console.error('[UserAuxiliaryDataService] Failed to ensure profile consistency on critical error:', profileError instanceof TimeoutError ? profileError.message : profileError);
      }
      
      return { // Return a safe default
        role: 'student',
        profileData: { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };
    }
  };

  return {
    fetchUserRoleAuxiliaryData,
  };
};
