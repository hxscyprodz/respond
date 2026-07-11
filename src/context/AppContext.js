import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { getProfile, saveProfile as persistProfile } from '../services/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setLoadingProfile(false));
  }, []);

  const updateProfile = useCallback(async (next) => {
    setProfile(next); // optimistic — profile is local-first
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
