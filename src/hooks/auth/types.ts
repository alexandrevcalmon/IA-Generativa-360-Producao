
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; needsPasswordChange?: boolean }>;
  signUp: (email: string, password: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  changePassword: (newPassword: string) => Promise<{ error: any }>;
  userRole: string | null;
  isProducer: boolean;
  isCompany: boolean;
  isStudent: boolean;
  needsPasswordChange: boolean;
  companyUserData: any;
  refreshUserRole: () => Promise<void>;
}

export interface UserRoleData {
  role: string | null;
  needsPasswordChange: boolean;
  companyUserData: any;
}
