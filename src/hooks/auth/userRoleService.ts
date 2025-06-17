
import { supabase } from '@/integrations/supabase/client';
import { UserRoleData } from './types';

export const fetchUserRole = async (userId: string): Promise<UserRoleData> => {
  try {
    console.group('🔍 Fetching user role and data for:', userId);
    
    // First check profiles table for producer/company roles
    console.log('📋 Checking profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    console.log('Profile query result:', { profile, profileError });
    
    if (!profileError && profile?.role && profile.role !== 'student') {
      console.log('✅ User role from profiles:', profile.role);
      console.groupEnd();
      return { 
        role: profile.role, 
        needsPasswordChange: false, 
        companyUserData: null 
      };
    }
    
    // Check company_users table for student role
    console.log('🏢 Checking company_users table...');
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select('*')
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    console.log('Company user query result:', {
      hasData: !!companyUser,
      error: companyUserError,
      companyId: companyUser?.company_id,
      isActive: companyUser?.is_active,
      needsPasswordChange: companyUser?.needs_password_change
    });
    
    if (!companyUserError && companyUser) {
      console.log('✅ User found in company_users');
      console.log('- Name:', companyUser.name);
      console.log('- Email:', companyUser.email);
      console.log('- Company ID:', companyUser.company_id);
      console.log('- Is Active:', companyUser.is_active);
      console.log('- Needs Password Change:', companyUser.needs_password_change);
      
      // Fetch company data separately for better reliability
      let companyData = null;
      if (companyUser.company_id) {
        console.log('📢 Fetching company data for ID:', companyUser.company_id);
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id, name, official_name')
          .eq('id', companyUser.company_id)
          .maybeSingle();
        
        console.log('Company query result:', {
          hasCompany: !!company,
          error: companyError,
          companyName: company?.name,
          officialName: company?.official_name
        });
        
        if (!companyError && company) {
          companyData = company;
          console.log('✅ Company data fetched successfully:', company.name);
        } else {
          console.warn('❌ Failed to fetch company data:', companyError);
        }
      }
      
      // Ensure proper boolean handling for needs_password_change
      const needsChange = companyUser.needs_password_change === true;
      console.log('🔐 Password change required:', needsChange);
      
      // Structure the data properly
      const companyUserWithCompany = {
        ...companyUser,
        companies: companyData
      };
      
      console.log('📦 Final company user data structure:', {
        name: companyUserWithCompany.name,
        email: companyUserWithCompany.email,
        companyName: companyUserWithCompany.companies?.name,
        hasCompanies: !!companyUserWithCompany.companies
      });
      
      console.groupEnd();
      
      return { 
        role: 'student', 
        needsPasswordChange: needsChange, 
        companyUserData: companyUserWithCompany 
      };
    }
    
    // Handle errors or missing data
    if (companyUserError) {
      console.error('❌ Error fetching company user data:', companyUserError);
    }
    
    // If user exists in profiles but not in company_users, respect the profile role
    if (profile?.role) {
      console.log('✅ Using profile role as fallback:', profile.role);
      console.groupEnd();
      return { 
        role: profile.role, 
        needsPasswordChange: false, 
        companyUserData: null 
      };
    }
    
    // Final fallback to student role
    console.log('🎓 Defaulting to student role');
    console.groupEnd();
    return { 
      role: 'student', 
      needsPasswordChange: false, 
      companyUserData: null 
    };
    
  } catch (error) {
    console.error('💥 Error in fetchUserRole:', error);
    console.groupEnd();
    return { 
      role: 'student', 
      needsPasswordChange: false, 
      companyUserData: null 
    };
  }
};
