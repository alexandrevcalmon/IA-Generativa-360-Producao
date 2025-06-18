
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

      // Default login path - try company login first, then fallback to regular login
      console.log(`[SignInService] Attempting default login path for ${email}`);
      const { data: loginAttempt, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        console.error(`[SignInService] Default login failed for ${email}. Error: ${loginError.message}`);
        
        if (loginError.message.includes('Invalid login credentials')) {
          toast({ title: "Credenciais inválidas", description: "Email ou senha incorretos.", variant: "destructive" });
        } else if (loginError.message.includes('Email not confirmed')) {
          toast({ title: "Email não confirmado", description: "Verifique seu email para confirmação.", variant: "destructive" });
        } else {
          toast({ title: "Erro no login", description: loginError.message, variant: "destructive" });
        }
        return { error: loginError };
      }

      if (loginAttempt.user) {
        const defaultResult = await defaultService.processDefaultSignIn(loginAttempt.user, role);
        console.log(`[SignInService] Default login successful for ${loginAttempt.user.email}. Needs Password Change: ${defaultResult.needsPasswordChange}`);
        return { 
          error: null, 
          user: loginAttempt.user, 
          session: loginAttempt.session, 
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
