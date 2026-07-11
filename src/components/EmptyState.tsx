import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme/tokens';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon?: IoniconName;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'warning';
}

export default function EmptyState({ icon = 'alert-circle-outline', title, body, actionLabel, onAction, tone = 'neutral' }: EmptyStateProps) {
  const iconColor = tone === 'warning' ? colors.fire : colors.inkSoft;

  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={22} color={iconColor} style={{ marginBottom: 8 }} />
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable style={styles.btn} onPress={onAction}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.paperRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 16,
  },
  title: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 4 },
  body: { fontSize: 13, color: colors.inkSoft, lineHeight: 19, marginBottom: 12 },
  btn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.ink,
  },
  btnText: { color: colors.paper, fontSize: 13, fontWeight: '500' },
});
