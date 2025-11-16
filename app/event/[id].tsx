import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserStore } from '@/store/userStore';
import { eventsAPI } from '@/services/api';
import { LargeButton } from '@/components/ui/large-button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  formatDisplayDate,
  formatDayOfWeek,
  getRelativeDateText,
  isEventPast,
} from '@/utils/dateUtils';
import type { Event } from '@/types';

export default function EventDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams<{ id: string }>();
  const { currentUser, interestedEventIds, addInterestedEvent, removeInterestedEvent } =
    useUserStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const { events } = await eventsAPI.getEvents();
      const foundEvent = events.find((e) => e.id === parseInt(params.id));
      setEvent(foundEvent || null);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInterest = async () => {
    if (!currentUser) {
      Alert.alert(
        'Perfil Necessário',
        'Crie o seu perfil para marcar interesse em eventos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Criar Perfil', onPress: () => router.push('/(tabs)/profile') },
        ]
      );
      return;
    }

    if (!event) return;

    const isInterested = interestedEventIds.has(event.id);

    try {
      setActionLoading(true);

      if (isInterested) {
        await eventsAPI.removeInterest(event.id, currentUser.id);
        removeInterestedEvent(event.id);
        Alert.alert('Sucesso', 'Interesse removido com sucesso!');
      } else {
        await eventsAPI.markInterest(event.id, currentUser.id);
        addInterestedEvent(event.id);
        Alert.alert('Sucesso', 'Interesse marcado com sucesso!');
      }

      await loadEvent();
    } catch (error) {
      console.error('Error toggling interest:', error);
      Alert.alert('Erro', 'Ocorreu um erro. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner message="A carregar evento..." />
      </View>
    );
  }

  const isPast = isEventPast(event.date);
  const isInterested = interestedEventIds.has(event.id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Event Name */}
      <Text style={[styles.title, { color: colors.text }]}>{event.name}</Text>

      {/* Date Card */}
      <Card style={styles.card}>
        <View style={styles.infoRow}>
          <IconSymbol name="calendar" size={28} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Data</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatDisplayDate(event.date)}
            </Text>
            <Text style={[styles.dayOfWeek, { color: colors.textSecondary }]}>
              {formatDayOfWeek(event.date)} • {getRelativeDateText(event.date)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Description Card */}
      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Descrição</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {event.description}
        </Text>
      </Card>

      {/* Interest Count Card */}
      <Card style={styles.card}>
        <View style={styles.infoRow}>
          <IconSymbol name="person.2.fill" size={28} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Pessoas Interessadas
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {event.interested_count}{' '}
              {event.interested_count === 1 ? 'pessoa' : 'pessoas'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {!isPast && (
          <LargeButton
            title={isInterested ? 'Remover Interesse' : 'Marcar Interesse'}
            onPress={handleToggleInterest}
            variant={isInterested ? 'outline' : 'primary'}
            loading={actionLoading}
            fullWidth
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.md,
  },
  card: {
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    ...Typography.caption,
    marginBottom: Spacing.xs / 2,
  },
  value: {
    ...Typography.h3,
  },
  dayOfWeek: {
    ...Typography.body,
    marginTop: Spacing.xs / 2,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodyLarge,
    lineHeight: 28,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
});
