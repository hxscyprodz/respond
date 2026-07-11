import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { detectCity, LOCATION_MESSAGES } from '../services/location';
import { findCity } from '../data/emergencyNumbers';
import PulseIndicator from '../components/PulseIndicator';
import EmptyState from '../components/EmptyState';
import { colors, radius, type } from '../theme/tokens';
import type { HomeStackParamList, LocationDetectionResult } from '../types';

const QUICK_CITIES = ['Harare', 'Bulawayo', 'Mutare', 'Gweru'];

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { isOnline, profile } = useApp();
  const [locState, setLocState] = useState<LocationDetectionResult>({ status: 'loading' });
  const [searchText, setSearchText] = useState('');
  const [notFound, setNotFound] = useState<string | null>(null);

  const runDetection = useCallback(() => {
    if (!isOnline) return;
    setLocState({ status: 'loading' });
    void detectCity().then(setLocState);
  }, [isOnline]);

  useEffect(() => {
    runDetection();
  }, [runDetection]);

  function goToCity(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const city = findCity(trimmed);
    if (city) {
      setNotFound(null);
      navigation.navigate('Results', { city });
    } else {
      setNotFound(trimmed);
    }
  }

  function renderLocationBlock() {
    if (locState.status === 'loading') {
      return (
        <View style={styles.locRow}>
          <Ionicons name="location-outline" size={16} color={colors.amberInk} />
          <Text style={styles.locText}>Detecting location…</Text>
        </View>
      );
    }
    if (locState.status === 'success') {
      return (
        <View style={styles.locRow}>
          <Ionicons name="location-outline" size={16} color={colors.amberInk} />
          <Text style={styles.locText}>
            Near {locState.city}
            {locState.region ? `, ${locState.region}` : ''}
          </Text>
        </View>
      );
    }

    const msg =
      locState.status === 'services-disabled' ||
      locState.status === 'permission-denied' ||
      locState.status === 'timeout' ||
      locState.status === 'geocode-empty' ||
      locState.status === 'error'
        ? LOCATION_MESSAGES[locState.status]
        : LOCATION_MESSAGES.error;

    return (
      <EmptyState
        icon={locState.status === 'permission-denied' || locState.status === 'services-disabled' ? 'lock-closed-outline' : 'navigate-outline'}
        title={msg.title}
        body={msg.body}
        actionLabel={msg.action === 'openSettings' ? 'Open settings' : 'Try again'}
        onAction={msg.action === 'openSettings' ? Linking.openSettings : runDetection}
      />
    );
  }

  const showManualSearchAlways = isOnline && locState.status !== 'success' && locState.status !== 'loading';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.pulseCard}>
        <Text style={type.label}>
          {isOnline ? 'Locating you automatically' : 'No connection — searching local directory'}
        </Text>
        <PulseIndicator online={isOnline} />
        {isOnline ? (
          renderLocationBlock()
        ) : (
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={16} color={colors.amberInk} />
            <Text style={styles.locText}>Search below, no network needed</Text>
          </View>
        )}
      </View>

      {(!isOnline || showManualSearchAlways) && (
        <View>
          <Text style={type.title}>Search by city or town</Text>
          <Text style={styles.sub}>
            {isOnline
              ? 'Location detection had trouble above — search manually instead.'
              : "No connection needed — this searches your device's saved directory."}
          </Text>
        </View>
      )}

      {isOnline && locState.status === 'success' && (
        <View>
          <Text style={type.title}>Emergency numbers near you</Text>
          <Text style={styles.sub}>We use your location automatically. If it's wrong, search a city instead.</Text>
        </View>
      )}

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={(t) => {
            setSearchText(t);
            if (notFound) setNotFound(null);
          }}
          placeholder="Search a city or town"
          placeholderTextColor={colors.inkFaint}
          returnKeyType="search"
          onSubmitEditing={() => goToCity(searchText)}
        />
        <Pressable style={styles.searchBtn} onPress={() => goToCity(searchText)}>
          <Text style={styles.searchBtnText}>Search</Text>
        </Pressable>
      </View>

      {notFound && (
        <EmptyState
          icon="search-outline"
          tone="warning"
          title={`No match for "${notFound}"`}
          body="Check the spelling, or try one of the nearby areas below that are in our directory."
        />
      )}

      <View style={styles.chipRow}>
        {QUICK_CITIES.map((c) => (
          <Pressable key={c} style={styles.chip} onPress={() => goToCity(c)}>
            <Text style={styles.chipText}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.savedBlock}>
        <View>
          <Text style={styles.savedLabel}>Default location</Text>
          <Text style={styles.savedPlace}>{profile?.city || 'Not set'}</Text>
        </View>
        <Pressable onPress={() => {
          const parentNavigator = navigation.getParent() as { navigate: (screen: string) => void } | undefined;
          parentNavigator?.navigate('Profile');
        }}>
          <Text style={styles.linkBtn}>Set up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper, padding: 20 },
  pulseCard: {
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 16,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  locText: { fontSize: 14, color: colors.ink },
  sub: { fontSize: 13, color: colors.inkSoft, marginTop: 4, marginBottom: 14, lineHeight: 19 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.paperRaised,
    color: colors.ink,
  },
  searchBtn: {
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  searchBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperRaised,
  },
  chipText: { fontSize: 12, color: colors.inkSoft },
  savedBlock: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedLabel: { fontSize: 12, color: colors.inkFaint },
  savedPlace: { fontSize: 14, fontWeight: '500', color: colors.ink },
  linkBtn: { fontSize: 12, color: colors.amberInk, fontWeight: '500' },
});
