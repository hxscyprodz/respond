import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView, Linking } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DeptCard from '../components/DeptCard';
import { colors, radius, type } from '../theme/tokens';
import type { EmergencyDepartment, HomeStackParamList } from '../types';

type ResultsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: ResultsScreenProps) {
  const { city } = route.params;
  const [selected, setSelected] = useState<EmergencyDepartment | null>(null);

  if (!city) {
    return (
      <View style={styles.screen}>
        <Text style={type.title}>Something went wrong</Text>
        <Text style={styles.meta}>We couldn't load numbers for that area.</Text>
        <Pressable style={styles.callBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.callText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  function confirmCall() {
    if (!selected) return;
    void Linking.openURL(`tel:${selected.number.replace(/\s/g, '')}`);
    setSelected(null);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={type.title}>{city.display}</Text>
        <Text style={styles.meta}>
          {city.region} · updated {city.updatedAt}
        </Text>

        {city.departments.map((d) => (
          <DeptCard key={d.name} department={d} onPressCall={setSelected} />
        ))}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Sample data for this prototype only — a production build would pull verified numbers
            from the contacts directory service and refresh them automatically.
          </Text>
        </View>
      </ScrollView>

      <Modal visible={Boolean(selected)} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetDept}>{selected?.name}</Text>
            <Text style={styles.sheetNum}>{selected?.number}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={() => setSelected(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.callBtn} onPress={confirmCall}>
                <Text style={styles.callText}>Call now</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: 20 },
  meta: { fontSize: 12, color: colors.inkFaint, marginBottom: 16 },
  disclaimer: {
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: radius.sm,
    padding: 12,
    marginTop: 4,
  },
  disclaimerText: { fontSize: 11, color: colors.inkFaint, lineHeight: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(24,26,28,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.paperRaised,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 22,
    alignItems: 'center',
  },
  sheetDept: { fontSize: 13, color: colors.inkSoft, marginBottom: 2 },
  sheetNum: { fontSize: 28, fontWeight: '600', color: colors.ink, marginBottom: 18 },
  actions: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  cancelText: { color: colors.inkSoft, fontWeight: '500' },
  callBtn: { flex: 1, padding: 14, borderRadius: radius.sm, backgroundColor: colors.fire, alignItems: 'center' },
  callText: { color: '#fff', fontWeight: '500' },
});
