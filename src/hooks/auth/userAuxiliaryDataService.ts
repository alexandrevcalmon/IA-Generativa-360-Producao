
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createProducerRoleService } from './producerRoleService';
import { createRoleManagementService } from './roleManagementService';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 3000; // Reduced from 10000ms to 3000ms to prevent long loops
const CACHE_DURATION = 5 * 60 * 1000; // Increased to 5 minutes for better performance
const MAX_RETRIES = 1; // Reduced from 2 to 1 to prevent loops

// Enhanced cache with better management
const requestCache = new Map();
const failureTracker = new Map();

export const createUserAuxiliaryDataService = () => {
  const producerRoleService = createProducerRoleService();
  const roleManagementService = createRoleManagementService();
  const recoveryService = createSessionRecoveryService();

  // Circuit breaker implementation
  const shouldSkipRequest = (cacheKey: string) => {
    const failures = failureTracker.get(cacheKey) || 0;
    return failures >= 2; // Stop after 2 consecutive failures
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
      // Return cached data if available, otherwise safe defaults
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
      // Single optimized query with reduced timeout
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

      // Check producer status with reduced timeout and retries
      const isProducerPromise = recoveryService.withRetry(async () => {
        return await withTimeout(
          producerRoleService.isUserProducer(user.id),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout checking producer status"
        );
      }, MAX_RETRIES);

      // Wait for both queries with race condition protection
      const [profileResult, isProducer] = await Promise.allSettled([
        userDataPromise,
        isProducerPromise
      ]);

      let result;

      // Handle producer check
      if (isProducer.status === 'fulfilled' && isProducer.value) {
        console.log('[UserAuxiliaryDataService] User is a producer');
        try {
          const producerData = await withTimeout(
            producerRoleService.getProducerData(user.id),
            OPTIMIZED_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout fetching producer data"
          );
          
          // Non-blocking profile consistency
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
        } catch (producerError) {
          console.warn('[UserAuxiliaryDataService] Producer data fetch failed, falling back to profile data');
          // Fall through to profile data handling
        }
      }

      // Handle profile data if not producer or producer data failed
      if (!result && profileResult.status === 'fulfilled' && profileResult.value?.data) {
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

      // Cache successful result
      requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
      recordSuccess(cacheKey);

      // Clean up old cache entries
      setTimeout(() => {
        for (const [key, value] of requestCache.entries()) {
          if (Date.now() - value.timestamp > CACHE_DURATION) {
            requestCache.delete(key);
          }
        }
      }, CACHE_DURATION);

      return result;

    } catch (criticalError) {
      console.error('[UserAuxiliaryDataService] Critical error in auxiliary data fetch:', criticalError);
      
      // Record failure for circuit breaker
      recordFailure(cacheKey);
      
      // Distinguish between different types of errors
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
      
      // Check for cached data to return during errors
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

      // Cache default result briefly
      requestCache.set(cacheKey, { data: defaultResult, timestamp: Date.now() });

      return defaultResult;
    }
  };

  return {
    fetchUserRoleAuxiliaryData,
  };
};
