import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILE: 'safeline:profile',
  DIRECTORY_VERSION: 'safeline:directoryVersion',
};

// Profile is read on every app open, so failures here must never block
// the UI — the app should still work with no profile at all.

export async function getProfile() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to read profile, continuing without it', e);
    return null;
  }
}

export async function saveProfile(profile) {
  try {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return true;
  } catch (e) {
    console.warn('Failed to save profile', e);
    return false;
  }
}

// Placeholder for the delta-sync version marker described in the
// architecture doc — used to ask the backend "what changed since X"
// instead of re-downloading the whole directory each time.

export async function getDirectoryVersion() {
  return (await AsyncStorage.getItem(KEYS.DIRECTORY_VERSION)) || '0';
}

export async function setDirectoryVersion(version) {
  await AsyncStorage.setItem(KEYS.DIRECTORY_VERSION, String(version));
}
