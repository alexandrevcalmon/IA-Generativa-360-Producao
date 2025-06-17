
import { supabase } from '@/integrations/supabase/client';
import { UserRoleData } from './types';

export const fetchUserRole = async (userId: string): Promise<UserRoleData> => {
  try {
    console.group('🔍 Fetching user role and data');
    console.log('User ID:', userId);
    
    // First check profiles table (producer/company)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    console.log('Profile query result:', { profile, profileError });
    
    if (!profileError && profile?.role) {
      console.log('✅ User role from profiles:', profile.role);
      console.groupEnd();
      return { role: profile.role, needsPasswordChange: false, companyUserData: null };
    }
    
    // Check company_users table (student/collaborator) with corrected JOIN
    console.log('🔍 Checking company_users table...');
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select(`
        *,
        companies!company_users_company_id_fkey(
          id,
          name,
          official_name
        )
      `)
      .eq('auth_user_id', userId)
      .maybeSingle();
    
    console.log('Company user query result:', {
      companyUser,
      companyUserError,
      hasData: !!companyUser,
      companyUserFields: companyUser ? Object.keys(companyUser) : 'no data'
    });
    
    if (!companyUserError && companyUser) {
      console.log('✅ User found in company_users:');
      console.log('- Name:', companyUser.name);
      console.log('- Email:', companyUser.email);
      console.log('- Position:', companyUser.position);
      console.log('- Phone:', companyUser.phone);
      console.log('- Company:', companyUser.companies?.name);
      console.log('- Is Active:', companyUser.is_active);
      console.log('- Needs Password Change:', companyUser.needs_password_change);
      
      const needsChange = companyUser.needs_password_change || false;
      console.log('🔐 Password change required:', needsChange);
      console.groupEnd();
      return { role: 'student', needsPasswordChange: needsChange, companyUserData: companyUser };
    }
    
    if (companyUserError) {
      console.error('❌ Error fetching company user data:', companyUserError);
      console.error('Error details:', {
        message: companyUserError.message,
        details: companyUserError.details,
        hint: companyUserError.hint,
        code: companyUserError.code
      });
    } else {
      console.log('ℹ️ No company user data found for user');
    }
    
    console.log('🎓 Defaulting to student role without company data');
    console.groupEnd();
    return { role: 'student', needsPasswordChange: false, companyUserData: null };
  } catch (error) {
    console.error('💥 Error in fetchUserRole:', error);
    console.groupEnd();
    return { role: 'student', needsPasswordChange: false, companyUserData: null };
  }
};
