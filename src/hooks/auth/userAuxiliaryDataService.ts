
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createProducerRoleService } from './producerRoleService';
import { createRoleManagementService } from './roleManagementService';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 3000; // Increased for better reliability
const CACHE_DURATION = 3 * 60 * 1000; // Reduced to 3 minutes for fresher data
const MAX_RETRIES = 1;

// Enhanced cache with user-specific keys
const requestCache = new Map();
const failureTracker = new Map();

export const createUserAuxiliaryDataService = () => {
  const producerRoleService = createProducerRoleService();
  const roleManagementService = createRoleManagementService();
  const recoveryService = createSessionRecoveryService();

  const shouldSkipRequest = (cacheKey: string) => {
    const failures = failureTracker.get(cacheKey) || 0;
    return failures >= 2;
  };

  const recordFailure = (cacheKey: string) => {
    const failures = failureTracker.get(cacheKey) || 0;
    failureTracker.set(cacheKey, failures + 1);
  };

  const recordSuccess = (cacheKey: string) => {
    failureTracker.delete(cacheKey);
  };

  const fetchUserRoleAuxiliaryData = async (user: User) => {
    const cacheKey = `user_aux_${user.id}`;
    
    // Check cache first
    if (requestCache.has(cacheKey)) {
      const cached = requestCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`[UserAuxiliaryDataService] Using cached data for user: ${user.email}`);
        return cached.data;
      }
    }

    // Circuit breaker check
    if (shouldSkipRequest(cacheKey)) {
      console.log(`[UserAuxiliaryDataService] Circuit breaker active for user: ${user.email}`);
      const cached = requestCache.get(cacheKey);
      if (cached) {
        return cached.data;
      }
      return {
        role: 'student',
        profileData: { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };
    }

    console.log(`[UserAuxiliaryDataService] Fetching auxiliary data for user: ${user.email}`);

    try {
      // Step 1: Check producer status FIRST with enhanced function
      let isProducer = false;
      let producerData = null;
      try {
        // Use the enhanced producer check that includes auto-migration
        const producerCheckResult = await withTimeout(
          supabase.rpc('is_current_user_producer_enhanced'),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout checking producer status"
        );
        
        isProducer = !producerCheckResult.error && producerCheckResult.data === true;
        
        if (isProducer) {
          console.log('[UserAuxiliaryDataService] User is confirmed as producer');
          
          // Get producer data
          producerData = await withTimeout(
            producerRoleService.getProducerData(user.id),
            OPTIMIZED_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout fetching producer data"
          );
          
          // Ensure profile consistency in background
          roleManagementService.ensureProfileConsistency(user.id, 'producer').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed (non-blocking):', error);
          });
          
          const result = {
            role: 'producer',
            profileData: { role: 'producer' },
            companyData: null,
            collaboratorData: null,
            producerData,
            needsPasswordChange: false,
          };
          
          requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
          recordSuccess(cacheKey);
          return result;
        }
      } catch (producerError) {
        console.warn('[UserAuxiliaryDataService] Producer check failed:', producerError);
      }

      // Step 2: Get basic profile data
      let profileData = null;
      try {
        const profileResult = await withTimeout(
          supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle(),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout fetching profile data"
        );
        
        if (!profileResult.error && profileResult.data) {
          profileData = profileResult.data;
        }
      } catch (profileError) {
        console.warn('[UserAuxiliaryDataService] Profile fetch failed:', profileError);
      }

      // Step 3: Check company ownership
      let companyData = null;
      try {
        const companyResult = await withTimeout(
          supabase
            .from('companies')
            .select('id, name, needs_password_change')
            .eq('auth_user_id', user.id)
            .maybeSingle(),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout fetching company data"
        );
        
        if (!companyResult.error && companyResult.data) {
          companyData = companyResult.data;
          console.log('[UserAuxiliaryDataService] User is a company owner');
          
          const result = {
            role: 'company',
            profileData: { role: 'company' },
            companyData,
            collaboratorData: null,
            producerData: null,
            needsPasswordChange: companyData?.needs_password_change || false,
          };
          
          roleManagementService.ensureProfileConsistency(user.id, 'company').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed (non-blocking):', error);
          });
          
          requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
          recordSuccess(cacheKey);
          return result;
        }
      } catch (companyError) {
        console.warn('[UserAuxiliaryDataService] Company check failed:', companyError);
      }

      // Step 4: Check collaborator status
      let collaboratorData = null;
      try {
        const collaboratorResult = await withTimeout(
          supabase
            .from('company_users')
            .select('id, needs_password_change, company_id')
            .eq('auth_user_id', user.id)
            .maybeSingle(),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout fetching collaborator data"
        );
        
        if (!collaboratorResult.error && collaboratorResult.data) {
          collaboratorData = collaboratorResult.data;
          
          // Get company name
          let companyName = 'Unknown Company';
          try {
            const companyNameResult = await withTimeout(
              supabase
                .from('companies')
                .select('name')
                .eq('id', collaboratorData.company_id)
                .maybeSingle(),
              OPTIMIZED_TIMEOUT,
              "[UserAuxiliaryDataService] Timeout fetching company name"
            );
            
            if (!companyNameResult.error && companyNameResult.data) {
              companyName = companyNameResult.data.name;
            }
          } catch (companyNameError) {
            console.warn('[UserAuxiliaryDataService] Company name fetch failed:', companyNameError);
          }
          
          console.log('[UserAuxiliaryDataService] User is a company collaborator');
          
          const result = {
            role: 'collaborator',
            profileData: { role: 'collaborator' },
            companyData: null,
            collaboratorData: {
              ...collaboratorData,
              company_name: companyName,
            },
            producerData: null,
            needsPasswordChange: collaboratorData?.needs_password_change || false,
          };
          
          roleManagementService.ensureProfileConsistency(user.id, 'collaborator').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed (non-blocking):', error);
          });
          
          requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
          recordSuccess(cacheKey);
          return result;
        }
      } catch (collaboratorError) {
        console.warn('[UserAuxiliaryDataService] Collaborator check failed:', collaboratorError);
      }

      // Step 5: Default to student with profile consistency
      const finalRole = profileData?.role && profileData.role !== 'student' ? profileData.role : 'student';
      console.log(`[UserAuxiliaryDataService] Using role: ${finalRole}`);
      
      const result = {
        role: finalRole,
        profileData: { role: finalRole },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };

      roleManagementService.ensureProfileConsistency(user.id, finalRole).catch(error => {
        console.warn('[UserAuxiliaryDataService] Profile consistency failed (non-blocking):', error);
      });
      
      requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
      recordSuccess(cacheKey);

      return result;

    } catch (criticalError) {
      console.error('[UserAuxiliaryDataService] Critical error in auxiliary data fetch:', criticalError);
      
      recordFailure(cacheKey);
      
      const is403Error = criticalError?.status === 403 || 
                        criticalError?.message?.includes('403') ||
                        criticalError?.message?.includes('Access denied') ||
                        criticalError?.message?.includes('Authentication required');
      
      const isTimeoutError = criticalError instanceof TimeoutError;
      
      if (is403Error) {
        console.warn('[UserAuxiliaryDataService] 403 error detected, likely RLS policy issue');
      } else if (isTimeoutError) {
        console.warn('[UserAuxiliaryDataService] Timeout error detected, server may be overloaded');
      }
      
      // Check for cached data
      const cached = requestCache.get(cacheKey);
      if (cached) {
        console.log('[UserAuxiliaryDataService] Returning cached data due to error');
        return cached.data;
      }
      
      // Return safe defaults
      const defaultResult = {
        role: 'student',
        profileData: { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };

      requestCache.set(cacheKey, { data: defaultResult, timestamp: Date.now() });
      return defaultResult;
    }
  };

  return {
    fetchUserRoleAuxiliaryData,
  };
};
