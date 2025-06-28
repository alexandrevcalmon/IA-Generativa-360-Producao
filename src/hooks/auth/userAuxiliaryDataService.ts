
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createProducerRoleService } from './producerRoleService';
import { createRoleManagementService } from './roleManagementService';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 10000; // Increased from 8000 to 10000ms for better reliability

export const createUserAuxiliaryDataService = () => {
  const producerRoleService = createProducerRoleService();
  const roleManagementService = createRoleManagementService();
  const recoveryService = createSessionRecoveryService();

  // Cache to avoid duplicate requests
  const requestCache = new Map();

  const fetchUserRoleAuxiliaryData = async (user: User) => {
    const cacheKey = `user_aux_${user.id}`;
    
    // Check cache first to avoid duplicate requests
    if (requestCache.has(cacheKey)) {
      console.log(`[UserAuxiliaryDataService] Using cached data for user: ${user.email}`);
      return requestCache.get(cacheKey);
    }

    console.log(`[UserAuxiliaryDataService] Fetching auxiliary data for user: ${user.email}`);

    try {
      // Single optimized query to get all user data at once
      const userDataPromise = withTimeout(
        supabase
          .from('profiles')
          .select(`
            role,
            companies!inner(id, name, needs_password_change),
            company_users!inner(id, needs_password_change, companies(name))
          `)
          .eq('id', user.id)
          .maybeSingle(),
        OPTIMIZED_TIMEOUT,
        "[UserAuxiliaryDataService] Timeout fetching user profile data"
      );

      // Check producer status with single call
      const isProducerPromise = recoveryService.withRetry(async () => {
        return await withTimeout(
          producerRoleService.isUserProducer(user.id),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout checking producer status"
        );
      }, 2); // Reduce retry attempts

      // Wait for both queries
      const [profileResult, isProducer] = await Promise.allSettled([
        userDataPromise,
        isProducerPromise
      ]);

      let result;

      // Handle producer check
      if (isProducer.status === 'fulfilled' && isProducer.value) {
        console.log('[UserAuxiliaryDataService] User is a producer');
        const producerData = await withTimeout(
          producerRoleService.getProducerData(user.id),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout fetching producer data"
        );
        
        // Ensure profile consistency without blocking
        roleManagementService.ensureProfileConsistency(user.id, 'producer').catch(error => {
          console.warn('[UserAuxiliaryDataService] Profile consistency failed for producer (non-blocking):', error);
        });
        
        result = {
          role: 'producer',
          profileData: { role: 'producer' },
          companyData: null,
          collaboratorData: null,
          producerData,
          needsPasswordChange: false,
        };
      } else {
        // Handle profile data
        if (profileResult.status === 'fulfilled' && profileResult.value?.data) {
          const profileData = profileResult.value.data;
          
          // Check if user is a company owner
          if (Array.isArray(profileData.companies) && profileData.companies.length > 0) {
            const companyData = profileData.companies[0];
            console.log('[UserAuxiliaryDataService] User is a company owner');
            
            roleManagementService.ensureProfileConsistency(user.id, 'company').catch(error => {
              console.warn('[UserAuxiliaryDataService] Profile consistency failed for company (non-blocking):', error);
            });
            
            result = {
              role: 'company',
              profileData: { role: 'company' },
              companyData,
              collaboratorData: null,
              producerData: null,
              needsPasswordChange: companyData?.needs_password_change || false,
            };
          }
          // Check if user is a collaborator
          else if (Array.isArray(profileData.company_users) && profileData.company_users.length > 0) {
            const collaboratorData = profileData.company_users[0];
            console.log('[UserAuxiliaryDataService] User is a company collaborator');
            
            roleManagementService.ensureProfileConsistency(user.id, 'collaborator').catch(error => {
              console.warn('[UserAuxiliaryDataService] Profile consistency failed for collaborator (non-blocking):', error);
            });
            
            result = {
              role: 'collaborator',
              profileData: { role: 'collaborator' },
              companyData: null,
              collaboratorData: {
                ...collaboratorData,
                company_name: collaboratorData.companies?.name || 'Unknown Company',
              },
              producerData: null,
              needsPasswordChange: collaboratorData?.needs_password_change || false,
            };
          }
          // Use explicit role from profiles
          else if (profileData.role && profileData.role !== 'student') {
            console.log(`[UserAuxiliaryDataService] Found role in profiles: ${profileData.role}`);
            result = {
              role: profileData.role,
              profileData: { role: profileData.role },
              companyData: null,
              collaboratorData: null,
              producerData: null,
              needsPasswordChange: false,
            };
          }
        }

        // Default to student role if nothing else matches
        if (!result) {
          console.log('[UserAuxiliaryDataService] Defaulting to student role');
          roleManagementService.ensureProfileConsistency(user.id, 'student').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed for student (non-blocking):', error);
          });
          
          result = {
            role: 'student',
            profileData: { role: 'student' },
            companyData: null,
            collaboratorData: null,
            producerData: null,
            needsPasswordChange: false,
          };
        }
      }

      // Cache result for 30 seconds to avoid duplicate requests
      requestCache.set(cacheKey, result);
      setTimeout(() => requestCache.delete(cacheKey), 30000);

      return result;

    } catch (criticalError) {
      console.error('[UserAuxiliaryDataService] Critical error in auxiliary data fetch:', criticalError);
      
      // Check if this is an auth failure that requires redirect
      if (criticalError?.message?.includes('Authentication required') || criticalError?.message?.includes('Access denied')) {
        throw criticalError; // Re-throw to trigger redirect
      }
      
      // Return safe defaults for other errors
      const defaultResult = {
        role: 'student',
        profileData: { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };

      // Cache default result briefly to avoid repeated failures
      requestCache.set(cacheKey, defaultResult);
      setTimeout(() => requestCache.delete(cacheKey), 5000);

      return defaultResult;
    }
  };

  return {
    fetchUserRoleAuxiliaryData,
  };
};
