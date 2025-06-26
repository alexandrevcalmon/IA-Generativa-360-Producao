import { jest } from '@jest/globals';
import { createCompanySignInService } from '@/hooks/auth/companySignInService';

// Mock auth utils
const checkCompanyByEmail = jest.fn();
const createCompanyAuthUser = jest.fn();
const updateUserMetadata = jest.fn();

jest.mock('@/hooks/auth/authUtils', () => ({
  checkCompanyByEmail,
  createCompanyAuthUser,
  updateUserMetadata
}));

// Mock supabase client
const signInWithPassword = jest.fn();

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { signInWithPassword },
  }
}));

describe('companySignInService edge cases', () => {
  const toast = jest.fn();
  const service = createCompanySignInService(toast);
  const user = { id: 'u1', email: 'test@c.com', user_metadata: {} } as any;
  const session = { access_token: 't' } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('auto creates auth user when credentials invalid', async () => {
    signInWithPassword
      .mockResolvedValueOnce({ data: null, error: { message: 'Invalid login credentials' } })
      .mockResolvedValueOnce({ data: { user, session }, error: null });

    checkCompanyByEmail.mockResolvedValueOnce({ companies: [{ id: 'c1', name: 'TestCo' }], companySearchError: null });
    createCompanyAuthUser.mockResolvedValueOnce({ data: { success: true }, error: null });

    const result = await service.signInCompany('test@c.com', 'pwd');

    expect(checkCompanyByEmail).toHaveBeenCalledWith('test@c.com');
    expect(createCompanyAuthUser).toHaveBeenCalledWith('test@c.com', 'c1');
    expect(updateUserMetadata).toHaveBeenCalledWith({ role: 'company', company_id: 'c1', company_name: 'TestCo' });
    expect(result).toEqual({ error: null, user, session, needsPasswordChange: true });
  });
});
