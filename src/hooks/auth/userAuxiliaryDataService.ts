
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createProducerRoleService } from './producerRoleService';
import { createRoleManagementService } from './roleManagementService';
import { createSessionRecoveryService } from './sessionRecoveryService';
import { withTimeout, TimeoutError } from '@/lib/utils';

const OPTIMIZED_TIMEOUT = 2000; // Further reduced to 2000ms to prevent long waits
const CACHE_DURATION = 10 * 60 * 1000; // Increased to 10 minutes for better performance
const MAX_RETRIES = 1; // Keep at 1 to prevent loops

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
      // Step 1: Get basic profile data with a simple, valid query
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

      // Step 2: Check producer status with reduced timeout
      let isProducer = false;
      let producerData = null;
      try {
        isProducer = await withTimeout(
          producerRoleService.isUserProducer(user.id),
          OPTIMIZED_TIMEOUT,
          "[UserAuxiliaryDataService] Timeout checking producer status"
        );
        
        if (isProducer) {
          console.log('[UserAuxiliaryDataService] User is a producer');
          producerData = await withTimeout(
            producerRoleService.getProducerData(user.id),
            OPTIMIZED_TIMEOUT,
            "[UserAuxiliaryDataService] Timeout fetching producer data"
          );
          
          const result = {
            role: 'producer',
            profileData: { role: 'producer' },
            companyData: null,
            collaboratorData: null,
            producerData,
            needsPasswordChange: false,
          };
          
          // Cache and return early for producers
          requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
          recordSuccess(cacheKey);
          return result;
        }
      } catch (producerError) {
        console.warn('[UserAuxiliaryDataService] Producer check failed:', producerError);
      }

      // Step 3: Check company ownership with separate, valid query
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
          
          // Update profile consistency in background (non-blocking)
          roleManagementService.ensureProfileConsistency(user.id, 'company').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed (non-blocking):', error);
          });
          
          // Cache and return early for company owners
          requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
          recordSuccess(cacheKey);
          return result;
        }
      } catch (companyError) {
        console.warn('[UserAuxiliaryDataService] Company check failed:', companyError);
      }

      // Step 4: Check collaborator status with separate, valid query
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
          
          // Get company name with separate query
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
          
          // Update profile consistency in background (non-blocking)
          roleManagementService.ensureProfileConsistency(user.id, 'collaborator').catch(error => {
            console.warn('[UserAuxiliaryDataService] Profile consistency failed (non-blocking):', error);
          });
          
          // Cache and return early for collaborators
          requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
          recordSuccess(cacheKey);
          return result;
        }
      } catch (collaboratorError) {
        console.warn('[UserAuxiliaryDataService] Collaborator check failed:', collaboratorError);
      }

      // Step 5: Use explicit role from profiles or default to student
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

      // Update profile consistency in background (non-blocking)
      roleManagementService.ensureProfileConsistency(user.id, finalRole).catch(error => {
        console.warn('[UserAuxiliaryDataService] Profile consistency failed (non-blocking):', error);
      });
      
      // Cache successful result
      requestCache.set(cacheKey, { data: result, timestamp: Date.now() });
      recordSuccess(cacheKey);

      // Clean up old cache entries periodically
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
      const is400Error = criticalError?.status === 400 || 
                        criticalError?.message?.includes('400') ||
                        criticalError?.message?.includes('Bad Request');
      
      if (is403Error) {
        console.warn('[UserAuxiliaryDataService] 403 error detected, likely RLS policy issue');
      } else if (isTimeoutError) {
        console.warn('[UserAuxiliaryDataService] Timeout error detected, server may be overloaded');
      } else if (is400Error) {
        console.warn('[UserAuxiliaryDataService] 400 error detected, likely invalid SQL query - using fallback');
      }
      
      // Check for cached data to return during errors
      const cached = requestCache.get(cacheKey);
      if (cached) {
        console.log('[UserAuxiliaryDataService] Returning cached data due to error');
        return cached.data;
      }
      
      // Return safe defaults with longer cache for errors
      const defaultResult = {
        role: 'student',
        profileData: { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false,
      };

      // Cache default result for longer during errors
      requestCache.set(cacheKey, { data: defaultResult, timestamp: Date.now() });

      return defaultResult;
    }
  };

  return {
    fetchUserRoleAuxiliaryData,
  };
};
