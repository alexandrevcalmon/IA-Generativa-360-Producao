
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createProducerRoleService } from './producerRoleService';
import { createRoleManagementService } from './roleManagementService';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 4000; // Reduced from 7000 to 4000ms

export const createUserAuxiliaryDataService = () => {
  const producerRoleService = createProducerRoleService();
  const roleManagementService = createRoleManagementService();
  const recoveryService = createSessionRecoveryService();

  const fetchUserRoleAuxiliaryData = async (user: User) => {
    console.log(`[UserAuxiliaryDataService] Fetching auxiliary data for user: ${user.email}`);

    try {
      // Enhanced producer check with retry
      try {
        const isProducer = await recoveryService.withRetry(async () => {
          return await withTimeout(
            producerRoleService.isUserProducer(user.id),
            OPTIMIZED_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout checking producer status"
          );
        });

        if (isProducer) {
          console.log('[UserAuxiliaryDataService] User is a producer');
          const producerData = await recoveryService.withRetry(async () => {
            return await withTimeout(
              producerRoleService.getProducerData(user.id),
              OPTIMIZED_TIMEOUT,
              "[UserAuxiliaryDataService] Timeout fetching producer data"
            );
          });
          
          // Ensure profile consistency without blocking
          roleManagementService.ensureProfileConsistency(user.id, 'producer').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed for producer (non-blocking):', error);
          });
          
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
        console.error('[UserAuxiliaryDataService] Producer check failed after retries:', error instanceof TimeoutError ? error.message : error);
        // Continue to next checks
      }

      // Enhanced company check with retry
      try {
        console.log('[UserAuxiliaryDataService] Checking if user is a company owner...');
        const companyResult = await recoveryService.withRetry(async () => {
          return await withTimeout(
            supabase
              .from('companies')
              .select('*, needs_password_change')
              .eq('auth_user_id', user.id)
              .maybeSingle(),
            OPTIMIZED_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout fetching company data"
          );
        });

        if (companyResult?.data) {
          console.log('[UserAuxiliaryDataService] User is a company owner');
          
          // Ensure profile consistency without blocking
          roleManagementService.ensureProfileConsistency(user.id, 'company').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed for company (non-blocking):', error);
          });
          
          return {
            role: 'company',
            profileData: { role: 'company' },
            companyData: companyResult.data,
            collaboratorData: null,
            producerData: null,
            needsPasswordChange: companyResult.data.needs_password_change || false,
          };
        }
      } catch (error) {
        console.error('[UserAuxiliaryDataService] Company check failed after retries:', error instanceof TimeoutError ? error.message : error);
      }

      // Enhanced profiles check with retry
      let profileDataFromProfilesTable: { role: string } | null = null;
      try {
        console.log('[UserAuxiliaryDataService] Checking profiles table...');
        const profileResult = await recoveryService.withRetry(async () => {
          return await withTimeout(
            supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .maybeSingle(),
            OPTIMIZED_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout fetching profile data"
          );
        });

        profileDataFromProfilesTable = profileResult?.data || null;

        if (profileDataFromProfilesTable?.role && 
            profileDataFromProfilesTable.role !== 'student' && 
            profileDataFromProfilesTable.role !== 'collaborator') {
          console.log(`[UserAuxiliaryDataService] Found role in profiles: ${profileDataFromProfilesTable.role}`);
          return {
            role: profileDataFromProfilesTable.role,
            profileData: profileDataFromProfilesTable,
            companyData: null,
            collaboratorData: null,
            producerData: null,
            needsPasswordChange: false,
          };
        }
      } catch (error) {
        console.error('[UserAuxiliaryDataService] Profiles check failed after retries:', error instanceof TimeoutError ? error.message : error);
      }

      // Enhanced collaborator check with retry
      try {
        console.log('[UserAuxiliaryDataService] Checking if user is a company collaborator...');
        const collaboratorResult = await recoveryService.withRetry(async () => {
          return await withTimeout(
            supabase
              .from('company_users')
              .select('*, needs_password_change, companies!inner(name)')
              .eq('auth_user_id', user.id)
              .maybeSingle(),
            OPTIMIZED_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout fetching collaborator data"
          );
        });

        const collaboratorData = collaboratorResult?.data;

        if (collaboratorData) {
          console.log('[UserAuxiliaryDataService] User is a company collaborator');
          
          // Ensure profile consistency without blocking
          roleManagementService.ensureProfileConsistency(user.id, 'collaborator').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed for collaborator (non-blocking):', error);
          });
          
          return {
            role: 'collaborator',
            profileData: profileDataFromProfilesTable || { role: 'collaborator' },
            companyData: null,
            collaboratorData: {
              ...collaboratorData,
              company_name: collaboratorData.companies?.name || 'Unknown Company',
            },
            producerData: null,
            needsPasswordChange: collaboratorData.needs_password_change || false,
          };
        }
      } catch (error) {
        console.error('[UserAuxiliaryDataService] Collaborator check failed after retries:', error instanceof TimeoutError ? error.message : error);
      }

      // Default to student role with non-blocking profile consistency
      console.log('[UserAuxiliaryDataService] Defaulting to student role');
      roleManagementService.ensureProfileConsistency(user.id, 'student').catch(error => {
        console.warn('[UserAuxiliaryDataService] Profile consistency failed for student (non-blocking):', error);
      });
      
      return {
        role: 'student',
        profileData: profileDataFromProfilesTable || { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };

    } catch (criticalError) {
      console.error('[UserAuxiliaryDataService] Critical error in auxiliary data fetch:', criticalError);
      
      // Check if this is an auth failure that requires redirect
      if (criticalError?.message?.includes('Authentication required')) {
        throw criticalError; // Re-throw to trigger redirect
      }
      
      // Return safe defaults for other errors
      return {
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
