
import { createSessionValidationService } from './sessionValidationService';

interface AuthInitializerProps {
  handleAuthStateChange: (event: string, session: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;
  clearUserState: () => void;
}

export function createAuthInitializer(props: AuthInitializerProps) {
  const { handleAuthStateChange, setLoading, setIsInitialized, clearUserState } = props;
  const sessionService = createSessionValidationService();

  const initializeAuth = async (isMounted: React.MutableRefObject<boolean>) => {
    try {
      console.log('🔍 Checking for existing session...');
      const validation = await sessionService.validateSession();

      if (!validation.isValid && validation.needsRefresh) {
        console.log('🔄 Session expired during init, attempting refresh...');
        try {
          const refreshResult = await sessionService.refreshSession();
          if (refreshResult.isValid && refreshResult.session && isMounted.current) {
            console.log('✅ Session refreshed during initialization');
            await handleAuthStateChange('SIGNED_IN', refreshResult.session);
          }
          // If refresh fails or component unmounts, it will fall through to the main finally
        } catch (refreshError) {
          console.error('💥 Error during session refresh in initialization:', refreshError);
          // Fall through to main finally to ensure state is cleaned up
        } finally {
          if (isMounted.current) {
            setLoading(false);
            setIsInitialized(true);
          }
        }
        return; // Exit after handling refresh attempt
      }
      
      if (validation.isValid && validation.session && isMounted.current) {
        console.log('✅ Found valid existing session');
        try {
          await handleAuthStateChange('SIGNED_IN', validation.session);
        } catch (e) {
          console.error('💥 Error during handleAuthStateChange in initialization:', e);
          // Ensure state is cleaned up even if handleAuthStateChange throws
        } finally {
          if (isMounted.current) {
            setLoading(false);
            setIsInitialized(true);
          }
        }
      } else {
        console.log('ℹ️ No valid session found during initialization');
        if (isMounted.current) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    } catch (error) {
      console.error('💥 Error during auth initialization (outer try):', error);
      if (isMounted.current) {
        clearUserState(); // Clear user state on outer error
        setLoading(false);
        setIsInitialized(true);
      }
    }
  };

  return { initializeAuth };
}
