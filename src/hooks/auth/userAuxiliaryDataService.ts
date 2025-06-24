
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createProducerRoleService } from './producerRoleService';
import { createRoleManagementService } from './roleManagementService';

export const createUserAuxiliaryDataService = () => {
  const producerRoleService = createProducerRoleService();
  const roleManagementService = createRoleManagementService();

  const fetchUserRoleAuxiliaryData = async (user: User) => {
    console.log(`[UserAuxiliaryDataService] Fetching auxiliary data for user: ${user.email}`);
    
    try {
      // First priority: Check if user is a producer using the new function
      const isProducer = await producerRoleService.isUserProducer(user.id);

      if (isProducer) {
        console.log('[UserAuxiliaryDataService] User is a producer');
        
        // Get producer data for additional info
        const producerData = await producerRoleService.getProducerData(user.id);
        
        // Update profiles table to ensure consistency
        await roleManagementService.ensureProfileConsistency(user.id, 'producer');
        
        return {
          role: 'producer',
          profileData: { role: 'producer' },
          companyData: null,
          collaboratorData: null,
          producerData,
          needsPasswordChange: false // Producers don't need password change
        };
      }

      // Second priority: Check if user is a company owner - FIXED: using .maybeSingle()
      console.log('[UserAuxiliaryDataService] Checking if user is a company owner...');
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*, needs_password_change')
        .eq('auth_user_id', user.id)
        .maybeSingle(); // FIXED: Changed from .single() to .maybeSingle() to prevent 406 errors

      if (companyError) {
        console.error('[UserAuxiliaryDataService] Error querying companies table:', companyError);
        // Don't throw error, continue with role detection
      } else if (companyData) {
        console.log('[UserAuxiliaryDataService] User is a company owner with data:', {
          companyId: companyData.id,
          companyName: companyData.name,
          needsPasswordChange: companyData.needs_password_change
        });
        
        // Update profiles table to ensure consistency
        await roleManagementService.ensureProfileConsistency(user.id, 'company');
        
        return {
          role: 'company',
          profileData: { role: 'company' },
          companyData,
          collaboratorData: null,
          producerData: null,
          needsPasswordChange: companyData.needs_password_change || false
        };
      } else {
        console.log('[UserAuxiliaryDataService] No company data found for user');
      }

      // Third priority: Check profiles table
      console.log('[UserAuxiliaryDataService] Checking profiles table...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle(); // FIXED: Using .maybeSingle() for consistency

      if (profileError) {
        console.error('[UserAuxiliaryDataService] Error querying profiles table:', profileError);
      } else if (profileData?.role && profileData.role !== 'student') {
        console.log(`[UserAuxiliaryDataService] Found role in profiles: ${profileData.role}`);
        return {
          role: profileData.role,
          profileData,
          companyData: null,
          collaboratorData: null,
          producerData: null,
          needsPasswordChange: false
        };
      }

      // Fourth priority: Check if user is a company collaborator - FIXED: using .maybeSingle()
      console.log('[UserAuxiliaryDataService] Checking if user is a company collaborator...');
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('company_users')
        .select(`
          *,
          needs_password_change,
          companies!inner(name)
        `)
        .eq('auth_user_id', user.id)
        .maybeSingle(); // FIXED: Changed from .single() to .maybeSingle()

      if (collaboratorError) {
        console.error('[UserAuxiliaryDataService] Error querying company_users table:', collaboratorError);
        // Don't throw error, continue with default role
      } else if (collaboratorData) {
        console.log('[UserAuxiliaryDataService] User is a company collaborator with data:', {
          collaboratorId: collaboratorData.id,
          companyName: collaboratorData.companies?.name,
          needsPasswordChange: collaboratorData.needs_password_change
        });
        
        return {
          role: 'collaborator',
          profileData,
          companyData: null,
          collaboratorData: {
            ...collaboratorData,
            company_name: collaboratorData.companies?.name || 'Unknown Company'
          },
          producerData: null,
          needsPasswordChange: collaboratorData.needs_password_change || false
        };
      } else {
        console.log('[UserAuxiliaryDataService] No collaborator data found for user');
      }

      // Default to student role - ensure profile exists
      console.log('[UserAuxiliaryDataService] Defaulting to student role and ensuring profile exists...');
      await roleManagementService.ensureProfileConsistency(user.id, 'student');
      
      return {
        role: 'student',
        profileData: { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false
      };

    } catch (error) {
      console.error('[UserAuxiliaryDataService] Critical error fetching auxiliary data:', error);
      
      // Ensure we always return a safe default even on critical errors
      try {
        await roleManagementService.ensureProfileConsistency(user.id, 'student');
      } catch (profileError) {
        console.error('[UserAuxiliaryDataService] Failed to ensure profile consistency:', profileError);
      }
      
      return {
        role: 'student',
        profileData: { role: 'student' },
        companyData: null,
        collaboratorData: null,
        producerData: null,
        needsPasswordChange: false
      };
    }
  };

  return {
    fetchUserRoleAuxiliaryData,
  };
};
