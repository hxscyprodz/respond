import * as Location from 'expo-location';
import type { LocationDetectionResult, LocationStatus } from '../types';

const DETECT_TIMEOUT_MS = 8000;

function timeout(ms: number): Promise<LocationDetectionResult> {
  return new Promise((resolve) => setTimeout(() => resolve({ status: 'timeout' }), ms));
}

export async function detectCity(): Promise<LocationDetectionResult> {
  try {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      return { status: 'services-disabled' };
    }

    const { status: permStatus, canAskAgain } = await Location.requestForegroundPermissionsAsync();
    if (permStatus !== 'granted') {
      return { status: 'permission-denied', canAskAgain };
    }

    const result = await Promise.race<Location.LocationObject | LocationDetectionResult>([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      timeout(DETECT_TIMEOUT_MS),
    ]);

    if ('status' in result) {
      return { status: 'timeout' };
    }

    const [place] = await Location.reverseGeocodeAsync({
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
    });

    const city = place?.city || place?.subregion || place?.region;
    if (!city) {
      return { status: 'geocode-empty' };
    }

    return { status: 'success', city, region: place?.country ?? undefined };
  } catch (error) {
    console.warn('Location detection failed', error);
    return { status: 'error' };
  }
}

export const LOCATION_MESSAGES: Record<Exclude<LocationStatus, 'loading' | 'success'>, { title: string; body: string; action: 'openSettings' | 'retry' }> = {
  'services-disabled': {
    title: 'Location services are off',
    body: 'Turn on location for this device to auto-detect your area, or search a city manually.',
    action: 'openSettings',
  },
  'permission-denied': {
    title: 'Location access denied',
    body: "SafeLine can't see your location without permission. You can still search a city manually below.",
    action: 'openSettings',
  },
  timeout: {
    title: "Couldn't get a location fix",
    body: 'This can happen indoors or with a weak signal. Try again, or search your city manually.',
    action: 'retry',
  },
  'geocode-empty': {
    title: 'Location found, but not matched',
    body: "We found your coordinates but couldn't match them to a known area. Search manually below.",
    action: 'retry',
  },
  error: {
    title: 'Something went wrong',
    body: 'We could not detect your location. Search your city manually below.',
    action: 'retry',
  },
};
