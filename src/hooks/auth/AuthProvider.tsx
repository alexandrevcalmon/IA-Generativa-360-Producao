
import { createContext, ReactNode } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuthState();
  
  const {
    user,
    session,
    loading,
    userRole,
    needsPasswordChange,
    companyUserData,
    isInitialized,
  } = authState;

  const authMethods = useAuthMethods(authState);

  // Role helper properties
  const isProducer = userRole === 'producer';
  const isCompany = userRole === 'company';
  const isStudent = userRole === 'student';

  const value = {
    user,
    session,
    loading: loading || !isInitialized,
    userRole,
    isProducer,
    isCompany,
    isStudent,
    needsPasswordChange,
    companyUserData,
    ...authMethods,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
