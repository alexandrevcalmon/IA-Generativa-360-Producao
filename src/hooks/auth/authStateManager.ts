import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserRoleAuxiliaryData } from './userRoleService';

export interface AuthState {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  needsPasswordChange: boolean;
  companyUserData: any;
  loading: boolean;
  isInitialized: boolean;
}

export interface AuthStateManager {
  getState: () => AuthState;
  updateState: (updates: Partial<AuthState>) => void;
  clearState: () => void;
  refreshUserData: (user: User) => Promise<void>;
}

export const createAuthStateManager = (
  initialState: AuthState,
  setState: (updates: Partial<AuthState>) => void
): AuthStateManager => {
  let currentState = { ...initialState };

  // Cache for user auxiliary data to avoid excessive API calls
  const userDataCache = new Map<string, {
    data: any;
    timestamp: number;
    expiresIn: number;
  }>();

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const updateState = (updates: Partial<AuthState>) => {
    currentState = { ...currentState, ...updates };
    setState(updates);
  };

  const getState = () => currentState;

  const clearState = () => {
    const clearedState: AuthState = {
      user: null,
      session: null,
      userRole: null,
      needsPasswordChange: false,
      companyUserData: null,
      loading: false,
      isInitialized: true,
    };
    currentState = clearedState;
    setState(clearedState);
    userDataCache.clear();
  };

  const getCachedUserData = (userId: string) => {
    const cached = userDataCache.get(userId);
    if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
      console.log('📦 Using cached user data for:', userId);
      return cached.data;
    }
    return null;
  };

  const setCachedUserData = (userId: string, data: any) => {
    userDataCache.set(userId, {
      data,
      timestamp: Date.now(),
      expiresIn: CACHE_DURATION,
    });
  };

  const refreshUserData = async (user: User) => {
    console.log('🔄 Refreshing user data for:', user.email);
    
    try {
      // Check cache first
      const cachedData = getCachedUserData(user.id);
      if (cachedData) {
        updateState({
          userRole: cachedData.role,
          needsPasswordChange: cachedData.needsPasswordChange || false,
          companyUserData: cachedData.companyData || cachedData.collaboratorData || null,
        });
        return;
      }

      // Fetch fresh data
      const auxData = await fetchUserRoleAuxiliaryData(user);
      const finalRole = auxData.role || 'student';
      
      // Cache the data
      setCachedUserData(user.id, auxData);

      updateState({
        userRole: finalRole,
        needsPasswordChange: auxData.needsPasswordChange || false,
        companyUserData: finalRole === 'company' ? auxData.companyData :
                         finalRole === 'collaborator' ? auxData.collaboratorData : null,
      });

      console.log('✅ User data refreshed successfully:', {
        userId: user.id,
        role: finalRole,
        needsPasswordChange: auxData.needsPasswordChange
      });
    } catch (error) {
      console.error('⚠️ Error refreshing user data:', error);
      
      // Fallback to basic user metadata
      updateState({
        userRole: user.user_metadata?.role || 'student',
        needsPasswordChange: false,
        companyUserData: null,
      });
    }
  };

  return {
    getState,
    updateState,
    clearState,
    refreshUserData,
  };
};