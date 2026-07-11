import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { getProfile, saveProfile as persistProfile } from '../services/storage';
import type { AppContextValue, Profile } from '../types';

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    void getProfile().then(setProfile).finally(() => setLoadingProfile(false));
  }, []);

  const updateProfile = useCallback(async (next: Profile | null) => {
    setProfile(next);
    await persistProfile(next);
  }, []);

  return (
    <AppContext.Provider value={{ isOnline, profile, updateProfile, loadingProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
