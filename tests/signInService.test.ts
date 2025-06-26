import { jest } from '@jest/globals';
import { createSignInService } from '@/hooks/auth/signInService';

// Mock the sub services
const mockProducer = jest.fn();
const mockCompany = jest.fn();
const mockProcessDefault = jest.fn();

jest.mock('@/hooks/auth/producerSignInService', () => ({
  createProducerSignInService: () => ({ signInProducer: mockProducer })
}));

jest.mock('@/hooks/auth/companySignInService', () => ({
  createCompanySignInService: () => ({ signInCompany: mockCompany })
}));

jest.mock('@/hooks/auth/defaultSignInService', () => ({
  createDefaultSignInService: () => ({ processDefaultSignIn: mockProcessDefault })
}));

// Mock supabase client for default login path
const signInWithPassword = jest.fn();

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { signInWithPassword }
  }
}));

describe('signInService flows', () => {
  const toast = jest.fn();
  const service = createSignInService(toast);
  const user = { id: '1', email: 'test@example.com', user_metadata: {} } as any;
  const session = { access_token: 'token' } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('producer flow delegates to producer service', async () => {
    mockProducer.mockResolvedValueOnce({ error: null, user, session, needsPasswordChange: false });

    const result = await service.signIn('p@e.com', 'pwd', 'producer');

    expect(mockProducer).toHaveBeenCalledWith('p@e.com', 'pwd');
    expect(result).toEqual({ error: null, user, session, needsPasswordChange: false });
  });

  test('company flow with existing company', async () => {
    mockCompany.mockResolvedValueOnce({ error: null, user, session, isCompany: true });

    const result = await service.signIn('c@e.com', 'pwd', 'company');

    expect(mockCompany).toHaveBeenCalledWith('c@e.com', 'pwd');
    expect(result).toEqual({ error: null, user, session, needsPasswordChange: false });
  });

  test('company flow falls back to default service', async () => {
    mockCompany.mockResolvedValueOnce({ error: null, user, session, isCompany: false });
    mockProcessDefault.mockResolvedValueOnce({ needsPasswordChange: true });

    const result = await service.signIn('c2@e.com', 'pwd', 'company');

    expect(mockCompany).toHaveBeenCalled();
    expect(mockProcessDefault).toHaveBeenCalledWith(user, 'company');
    expect(result).toEqual({ error: null, user, session, needsPasswordChange: true });
  });

  test('collaborator flow uses default service', async () => {
    signInWithPassword.mockResolvedValueOnce({ data: { user, session }, error: null });
    mockProcessDefault.mockResolvedValueOnce({ needsPasswordChange: false });

    const result = await service.signIn('col@e.com', 'pwd', 'collaborator');

    expect(signInWithPassword).toHaveBeenCalled();
    expect(mockProcessDefault).toHaveBeenCalledWith(user, 'collaborator');
    expect(result).toEqual({ error: null, user, session, needsPasswordChange: false });
  });

  test('student/default flow', async () => {
    signInWithPassword.mockResolvedValueOnce({ data: { user, session }, error: null });
    mockProcessDefault.mockResolvedValueOnce({ needsPasswordChange: false });

    const result = await service.signIn('s@e.com', 'pwd');

    expect(signInWithPassword).toHaveBeenCalled();
    expect(mockProcessDefault).toHaveBeenCalledWith(user, undefined);
    expect(result).toEqual({ error: null, user, session, needsPasswordChange: false });
  });
});
