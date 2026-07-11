export const colors = {
  paper: '#F6F4EF',
  paperRaised: '#FFFFFF',
  ink: '#181A1C',
  inkSoft: '#5C5B57',
  inkFaint: '#9C9A94',
  line: '#DEDBD2',
  amber: '#E8A23D',
  amberInk: '#5A3C0F',
  police: '#2C5679',
  policeTint: '#E5EDF2',
  fire: '#C1442E',
  fireTint: '#F7E7E3',
  ambulance: '#A22F52',
  ambulanceTint: '#F3E4EA',
  other: '#4C6B47',
  otherTint: '#E7EDE3',
  ok: '#4C7A3D',
};

export const radius = { sm: 10, md: 14, lg: 18 };

export const type = {
  title: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  sub: { fontSize: 13, fontWeight: '400', color: colors.inkSoft },
  label: { fontSize: 12, fontWeight: '500', color: colors.inkSoft },
  number: { fontSize: 16, fontWeight: '600' },
};

// department key -> accent color, used consistently across cards and dial sheet
export function deptColors(key) {
  const map = {
    police: { color: colors.police, tint: colors.policeTint },
    fire: { color: colors.fire, tint: colors.fireTint },
    ambulance: { color: colors.ambulance, tint: colors.ambulanceTint },
    other: { color: colors.other, tint: colors.otherTint },
  };
  return map[key] || map.other;
}
