
import { createProducerSignInService } from './producerSignInService';
import { createCompanySignInService } from './companySignInService';
import { createDefaultSignInService } from './defaultSignInService';

export const createSignInService = (toast: any) => {
  const producerService = createProducerSignInService(toast);
  const companyService = createCompanySignInService(toast);
  const defaultService = createDefaultSignInService(toast);

  const signIn = async (email: string, password: string, role?: string) => {
    try {
      console.log(`[SignInService] Attempting sign-in. Email: ${email}, Role: ${role}`);

      // Producer login path
      if (role === 'producer') {
        return await producerService.signInProducer(email, password);
      }

      // Company login path (explicit role=company)
      if (role === 'company') {
        const result = await companyService.signInCompany(email, password);
        if (result.error) {
          return result;
        }
        
        if (result.user) {
          const defaultResult = await defaultService.processDefaultSignIn(result.user, role);
          return { 
            error: null, 
            user: result.user, 
            session: result.session, 
            needsPasswordChange: defaultResult.needsPasswordChange 
          };
        }
      }

      // Default login path (students, collaborators, or unspecified role)
      const result = await companyService.signInCompany(email, password);
      if (result.error) {
        return result;
      }

      if (result.user) {
        const defaultResult = await defaultService.processDefaultSignIn(result.user, role);
        console.log(`[SignInService] Sign-in for ${result.user.email} completed. Needs Password Change: ${defaultResult.needsPasswordChange}`);
        return { 
          error: null, 
          user: result.user, 
          session: result.session, 
          needsPasswordChange: defaultResult.needsPasswordChange 
        };
      }

      console.error(`[SignInService] Login attempt for ${email} resulted in no error but also no user object.`);
      return { error: new Error("No user data after login attempt.") };

    } catch (e: any) {
      console.error(`[SignInService] Critical unhandled error during signIn for ${email}:`, e.message, e.stack);
      toast({ title: "Erro Crítico no Login", description: "Um problema inesperado ocorreu.", variant: "destructive" });
      return { error: { message: e.message, name: "CriticalErrorSignInService" } };
    }
  };

  return { signIn };
};
