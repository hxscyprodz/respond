// Bundled offline directory. Shape mirrors what the contacts directory
// service returns, so swapping the data source for a real API later
// (see services/directory.js) requires no changes in the UI layer.
//
// In production this file is replaced by a versioned dataset downloaded
// from the CDN/edge cache and stored via services/storage.js, refreshed
// on a delta-sync schedule from the backend.

export const EMERGENCY_DIRECTORY = {
  harare: {
    display: 'Harare',
    region: 'Zimbabwe',
    updatedAt: '2026-06-01',
    departments: [
      { name: 'Police', number: '112', icon: 'shield', key: 'police' },
      { name: 'Fire department', number: '993', icon: 'fire', key: 'fire' },
      { name: 'Ambulance', number: '994', icon: 'kit-medical', key: 'ambulance' },
      { name: 'Disaster management', number: '0242 700 000', icon: 'alert-triangle', key: 'other' },
    ],
  },
  bulawayo: {
    display: 'Bulawayo',
    region: 'Zimbabwe',
    updatedAt: '2026-06-01',
    departments: [
      { name: 'Police', number: '112', icon: 'shield', key: 'police' },
      { name: 'Fire department', number: '993', icon: 'fire', key: 'fire' },
      { name: 'Ambulance', number: '994', icon: 'kit-medical', key: 'ambulance' },
    ],
  },
  mutare: {
    display: 'Mutare',
    region: 'Zimbabwe',
    updatedAt: '2026-06-01',
    departments: [
      { name: 'Police', number: '112', icon: 'shield', key: 'police' },
      { name: 'Ambulance', number: '994', icon: 'kit-medical', key: 'ambulance' },
    ],
  },
  gweru: {
    display: 'Gweru',
    region: 'Zimbabwe',
    updatedAt: '2026-06-01',
    departments: [
      { name: 'Police', number: '112', icon: 'shield', key: 'police' },
      { name: 'Fire department', number: '993', icon: 'fire', key: 'fire' },
    ],
  },
};

// Sample data for prototype purposes only — not verified for real use.
// A production build sources and version-controls this from the
// contacts directory service, with an editorial review workflow.

export function findCity(query) {
  const key = query.trim().toLowerCase();
  if (EMERGENCY_DIRECTORY[key]) return EMERGENCY_DIRECTORY[key];
  return Object.values(EMERGENCY_DIRECTORY).find(
    (c) => c.display.toLowerCase() === key
  );
}
