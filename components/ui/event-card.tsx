import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatDisplayDate, getRelativeDateText, isEventPast } from '@/utils/dateUtils';
import type { Event } from '@/types';
import { IconSymbol } from './icon-symbol';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  isInterested?: boolean;
  style?: ViewStyle;
}

export function EventCard({ event, onPress, isInterested = false, style }: EventCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isPast = isEventPast(event.date);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          opacity: isPast ? 0.7 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Evento: ${event.name}. Data: ${formatDisplayDate(event.date)}. ${
        event.interested_count
      } pessoas interessadas.`}
    >
      {/* Header with date badge */}
      <View style={styles.header}>
        <View
          style={[
            styles.dateBadge,
            {
              backgroundColor: isPast ? colors.disabled : colors.primary,
            },
          ]}
        >
          <Text style={styles.dateText}>{getRelativeDateText(event.date)}</Text>
        </View>
        {isInterested && (
          <View style={[styles.interestedBadge, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="heart.fill" size={16} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Event name */}
      <Text
        style={[styles.title, { color: colors.text }]}
        numberOfLines={2}
        accessible={true}
        accessibilityRole="header"
      >
        {event.name}
      </Text>

      {/* Event description */}
      <Text
        style={[styles.description, { color: colors.textSecondary }]}
        numberOfLines={3}
      >
        {event.description}
      </Text>

      {/* Footer with interest count */}
      <View style={styles.footer}>
        <View style={styles.interestCount}>
          <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
          <Text style={[styles.interestText, { color: colors.textSecondary }]}>
            {event.interested_count} {event.interested_count === 1 ? 'pessoa' : 'pessoas'} interessada
            {event.interested_count === 1 ? '' : 's'}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={24} color={colors.icon} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dateBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.small,
  },
  dateText: {
    ...Typography.caption,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  interestedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  interestCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  interestText: {
    ...Typography.caption,
  },
});
