# SafeLine — React Native prototype

An offline-first emergency contacts app: search or auto-detect your location,
tap a department, confirm, and dial straight from the app.

## Run it

```
npx create-expo-app safeline --template blank
# then copy App.js and src/ from this folder into the new project, replacing package.json
npm install
npx expo start
```

Requires a physical device or simulator with location + phone permissions
(iOS Simulator can't place real calls — test dialing on a physical device
or Android emulator with a phone app installed).

## What's real vs stubbed

**Real, working native behavior:**
- `expo-location` for GPS + reverse geocoding (online mode)
- `@react-native-community/netinfo` for detecting actual connectivity
- `Linking.openURL('tel:...')` for native dialing
- `AsyncStorage` for a genuinely offline-first profile — works with zero network

**Stubbed for this prototype, needs backend wiring:**
- `src/data/emergencyNumbers.js` is a small bundled JSON file. In production this
  gets replaced by a versioned dataset synced from the contacts directory service
  described in the architecture — see `getDirectoryVersion` / `setDirectoryVersion`
  in `src/services/storage.js`, which are the hooks for that delta-sync logic.
- There's no API client yet. The next piece to build is `src/services/directory.js`:
  fetch changes since the stored version, merge into local storage, fall back
  silently to the bundled/cached copy on failure.
- For a country/city dataset at real scale, swap the flat JSON for `expo-sqlite`
  so lookups stay fast with tens of thousands of entries.

## Structure

```
App.js                        navigation root (bottom tabs: Home, Profile)
src/
  context/AppContext.js       online status, profile state, shared across screens
  services/location.js        GPS + reverse geocode, always fails gracefully to null
  services/storage.js         AsyncStorage wrapper for profile + sync version
  data/emergencyNumbers.js     bundled offline directory (schema mirrors backend API)
  components/PulseIndicator.js the connectivity-state visual (online wave / offline dashes)
  components/DeptCard.js       one department row + call button
  screens/HomeScreen.js        online/offline modes, search, default location
  screens/ResultsScreen.js     department list + dial confirmation modal
  screens/ProfileScreen.js     set default location, saved locally first
```

## Next steps worth prioritizing

1. `services/directory.js` — the actual sync client talking to the contacts
   directory service and API gateway from the architecture diagram.
2. Replace bundled JSON with `expo-sqlite` once you're past a handful of demo cities.
3. Add a background sync task (`expo-background-fetch`) so the directory refreshes
   even when the user hasn't opened the app in a while.
4. Real permission-denied and no-GPS-fix UX on the home screen (currently falls
   back to a text prompt — fine for a prototype, worth a proper empty state).
