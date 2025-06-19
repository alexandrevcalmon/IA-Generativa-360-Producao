
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
          producerData
        };
      }

      // Second priority: Check if user is a company owner
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (!companyError && companyData) {
        console.log('[UserAuxiliaryDataService] User is a company owner');
        
        // Update profiles table to ensure consistency
        await roleManagementService.ensureProfileConsistency(user.id, 'company');
        
        return {
          role: 'company',
          profileData: { role: 'company' },
          companyData,
          collaboratorData: null,
          producerData: null
        };
      }

      // Third priority: Check profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData?.role && profileData.role !== 'student') {
        console.log(`[UserAuxiliaryDataService] Found role in profiles: ${profileData.role}`);
        return {
          role: profileData.role,
          profileData,
          companyData: null,
          collaboratorData: null,
          producerData: null
        };
      }

      // Fourth priority: Check if user is a company collaborator
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('company_users')
        .select(`
          *,
          companies!inner(name)
        `)
        .eq('auth_user_id', user.id)
        .single();

      if (!collaboratorError && collaboratorData) {
        console.log('[UserAuxiliaryDataService] User is a company collaborator');
        return {
          role: 'collaborator',
          profileData,
          companyData: null,
          collaboratorData: {
            ...collaboratorData,
            company_name: collaboratorData.companies?.name || 'Unknown Company'
          },
          producerData: null
        };
      }

      // Default to student role
      console.log('[UserAuxiliaryDataService] Defaulting to student role');
      return {
        role: 'student',
        profileData,
        companyData: null,
        collaboratorData: null,
        producerData: null
      };

    } catch (error) {
      console.error('[UserAuxiliaryDataService] Error fetching auxiliary data:', error);
      return {
        role: 'student',
        profileData: null,
        companyData: null,
        collaboratorData: null,
        producerData: null
      };
    }
  };

  return {
    fetchUserRoleAuxiliaryData,
  };
};
