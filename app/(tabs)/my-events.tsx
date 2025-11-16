import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserStore } from '@/store/userStore';
import { eventsAPI } from '@/services/api';
import { EventCard } from '@/components/ui/event-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { isEventUpcoming } from '@/utils/dateUtils';
import type { Event } from '@/types';

export default function MyEventsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentUser, interestedEventIds } = useUserStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      const { events: allEvents } = await eventsAPI.getEvents();
      
      // Filter to only show events user is interested in
      const myEvents = allEvents.filter((event) => interestedEventIds.has(event.id));
      setEvents(myEvents);
    } catch (error) {
      console.error('Error loading my events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interestedEventIds]);

  const upcomingEvents = events.filter((event) => isEventUpcoming(event.date));
  const pastEvents = events.filter((event) => !isEventUpcoming(event.date));

  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="person.crop.circle"
          title="Sem Perfil"
          message="Crie o seu perfil para marcar interesse em eventos."
          actionLabel="Criar Perfil"
          onAction={() => {
            // TODO: Navigate to profile creation
            console.log('Navigate to profile');
          }}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner message="A carregar os seus eventos..." />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="calendar"
          title="Nenhum Evento"
          message="Ainda não marcou interesse em nenhum evento. Explore os eventos disponíveis e marque os que lhe interessam!"
          actionLabel="Ver Eventos"
          onAction={() => {
            // Navigation will happen automatically via tab
            console.log('Navigate to events');
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={[{ type: 'upcoming' }, { type: 'past' }]}
        renderItem={({ item }) => {
          if (item.type === 'upcoming') {
            return (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Próximos Eventos ({upcomingEvents.length})
                </Text>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onPress={() => router.push(`/event/${event.id}`)}
                      isInterested={true}
                    />
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Nenhum evento próximo
                  </Text>
                )}
              </View>
            );
          } else {
            return (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Eventos Anteriores ({pastEvents.length})
                </Text>
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onPress={() => router.push(`/event/${event.id}`)}
                      isInterested={true}
                    />
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Nenhum evento anterior
                  </Text>
                )}
              </View>
            );
          }
        }}
        keyExtractor={(item) => item.type}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
});
