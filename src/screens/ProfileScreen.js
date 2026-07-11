import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, radius, type } from '../theme/tokens';

export default function ProfileScreen() {
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile?.name || '');
  const [city, setCity] = useState(profile?.city || '');
  const [savedFlash, setSavedFlash] = useState(false);

  async function handleSave() {
    if (!city.trim()) return;
    await updateProfile({ name: name.trim(), city: city.trim() });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  return (
    <View style={styles.screen}>
      <Text style={type.title}>Your default location</Text>
      <Text style={styles.sub}>
        Set this once so your local emergency numbers are always one tap away, even offline.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Name (optional)</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.inkFaint} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Default city or town</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. Harare" placeholderTextColor={colors.inkFaint} />
      </View>

      {savedFlash && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Default location saved. It'll sync next time you're online.</Text>
        </View>
      )}

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save default location</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: 20 },
  sub: { fontSize: 13, color: colors.inkSoft, marginTop: 4, marginBottom: 18, lineHeight: 19 },
  field: { marginBottom: 14 },
  label: { fontSize: 12, color: colors.inkSoft, marginBottom: 6 },
  input: {
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.paperRaised,
    color: colors.ink,
  },
  toast: {
    backgroundColor: colors.policeTint,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  toastText: { fontSize: 11, color: colors.police },
  saveBtn: { backgroundColor: colors.ink, padding: 14, borderRadius: radius.sm, alignItems: 'center' },
  saveBtnText: { color: colors.paper, fontWeight: '500', fontSize: 14 },
});
