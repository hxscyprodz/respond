import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, deptColors } from '../theme/tokens';
import type { EmergencyDepartment } from '../types';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, IoniconName> = {
  shield: 'shield-checkmark-outline',
  fire: 'flame-outline',
  'kit-medical': 'medkit-outline',
  'alert-triangle': 'warning-outline',
};

interface DeptCardProps {
  department: EmergencyDepartment;
  onPressCall: (department: EmergencyDepartment) => void;
}

export default function DeptCard({ department, onPressCall }: DeptCardProps) {
  const accent = deptColors(department.key);
  const iconName = ICONS[department.icon] || 'help-circle-outline';

  return (
    <View style={[styles.card, { borderLeftColor: accent.color }]}> 
      <View style={[styles.iconWrap, { backgroundColor: accent.tint }]}> 
        <Ionicons name={iconName} size={20} color={accent.color} />
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{department.name}</Text>
        <Text style={[styles.number, { color: accent.color }]}>{department.number}</Text>
      </View>

      <Pressable
        accessibilityLabel={`Call ${department.name}`}
        onPress={() => onPressCall(department)}
        style={({ pressed }) => [styles.callBtn, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="call-outline" size={18} color={colors.paper} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperRaised,
    borderLeftWidth: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: colors.ink },
  number: { fontFamily: 'IBMPlexMono-SemiBold', fontSize: 15, fontWeight: '600', marginTop: 2 },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
