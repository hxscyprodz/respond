import type { EmergencyCity } from '../types';

export const EMERGENCY_DIRECTORY: Record<string, EmergencyCity> = {
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

export function findCity(query: string): EmergencyCity | undefined {
  const key = query.trim().toLowerCase();
  if (EMERGENCY_DIRECTORY[key]) return EMERGENCY_DIRECTORY[key];
  return Object.values(EMERGENCY_DIRECTORY).find((city) => city.display.toLowerCase() === key);
}
