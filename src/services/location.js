import * as Location from 'expo-location';

// Structured result instead of null/throw, so the UI can show a specific,
// actionable message for each failure mode rather than one generic error.
// Every branch resolves (never rejects) — location is a convenience path,
// it must never be able to crash or hang the app.

const DETECT_TIMEOUT_MS = 8000;

function timeout(ms) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ status: 'timeout' }), ms)
  );
}

export async function detectCity() {
  try {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      return { status: 'services-disabled' };
    }

    const { status: permStatus, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();
    if (permStatus !== 'granted') {
      return { status: 'permission-denied', canAskAgain };
    }

    const result = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      timeout(DETECT_TIMEOUT_MS),
    ]);

    if (result?.status === 'timeout') {
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

    return { status: 'success', city, region: place.country };
  } catch (e) {
    console.warn('Location detection failed', e);
    return { status: 'error' };
  }
}

// Human-facing copy for each status, kept alongside the service so the
// wording stays consistent anywhere it's shown.
export const LOCATION_MESSAGES = {
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
