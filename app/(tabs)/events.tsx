import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserStore } from '@/store/userStore';
import { eventsAPI } from '@/services/api';
import { EventCard } from '@/components/ui/event-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { LargeButton } from '@/components/ui/large-button';
import type { Event } from '@/types';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentUser, interestedEventIds, addInterestedEvent, removeInterestedEvent } = useUserStore();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { events: fetchedEvents } = await eventsAPI.getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleEventPress = (event: Event) => {
    router.push(`/event/${event.id}`);
  };

  const handleToggleInterest = async (event: Event) => {
    if (!currentUser) {
      // TODO: Show message to create profile first
      console.log('User needs to create profile');
      return;
    }

    const isInterested = interestedEventIds.has(event.id);
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (isInterested) {
        await eventsAPI.removeInterest(event.id, currentUser.id);
        removeInterestedEvent(event.id);
      } else {
        await eventsAPI.markInterest(event.id, currentUser.id);
        addInterestedEvent(event.id);
      }
      
      // Reload events to get updated interest counts
      await loadEvents();
    } catch (error) {
      console.error('Error toggling interest:', error);
      // TODO: Show error message
    }
  };

  const filteredEvents = filter === 'upcoming' 
    ? events.filter(event => {
        // Simple upcoming filter - can be enhanced
        return true; // For now show all
      })
    : events;

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner message="A carregar eventos..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'all' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFilter('all');
          }}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? '#FFFFFF' : colors.text },
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'upcoming' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFilter('upcoming');
          }}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'upcoming' ? '#FFFFFF' : colors.text },
            ]}
          >
            Próximos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Events list */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Nenhum Evento"
          message="Não há eventos disponíveis no momento. Tente novamente mais tarde."
          actionLabel="Atualizar"
          onAction={handleRefresh}
        />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <EventCard
                event={item}
                onPress={() => handleEventPress(item)}
                isInterested={interestedEventIds.has(item.id)}
              />
              {currentUser && (
                <LargeButton
                  title={
                    interestedEventIds.has(item.id)
                      ? '❤️ Já Marcou Interesse'
                      : '🤍 Marcar Interesse'
                  }
                  onPress={() => handleToggleInterest(item)}
                  variant={interestedEventIds.has(item.id) ? 'secondary' : 'primary'}
                  fullWidth
                  style={styles.interestButton}
                />
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterText: {
    ...Typography.body,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  interestButton: {
    marginBottom: Spacing.md,
  },
});
