import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';

const KEYS = {
  PROFILE: 'safeline:profile',
  DIRECTORY_VERSION: 'safeline:directoryVersion',
};

export async function getProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROFILE);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch (error) {
    console.warn('Failed to read profile, continuing without it', error);
    return null;
  }
}

export async function saveProfile(profile: Profile | null): Promise<boolean> {
  try {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.warn('Failed to save profile', error);
    return false;
  }
}

export async function getDirectoryVersion(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.DIRECTORY_VERSION)) || '0';
}

export async function setDirectoryVersion(version: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.DIRECTORY_VERSION, String(version));
}
