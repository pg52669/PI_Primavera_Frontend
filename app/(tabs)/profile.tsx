import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/card';
import { LargeButton } from '@/components/ui/large-button';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentUser } = useUserStore();

  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Bem-vindo!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Crie o seu perfil para começar a explorar eventos na sua comunidade.
          </Text>
          <LargeButton
            title="Criar Perfil"
            onPress={() => {
              // TODO: Navigate to registration
              console.log('Navigate to registration');
            }}
            variant="primary"
            fullWidth
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={[styles.title, { color: colors.text }]}>Meu Perfil</Text>

      <Card style={styles.card}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nome</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentUser.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Idade</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentUser.age} anos</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Morada</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {currentUser.street}, {currentUser.street_number}
            {currentUser.apartment && `, ${currentUser.apartment}`}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {currentUser.postal_code} {currentUser.city}
          </Text>
        </View>

        {currentUser.is_volunteer && (
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text style={styles.badgeText}>✓ Voluntário</Text>
          </View>
        )}
      </Card>

      <LargeButton
        title="Editar Perfil"
        onPress={() => {
          // TODO: Navigate to edit profile
          console.log('Navigate to edit profile');
        }}
        variant="outline"
        fullWidth
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyLarge,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  card: {
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    marginBottom: Spacing.xs / 2,
  },
  value: {
    ...Typography.bodyLarge,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  badgeText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  button: {
    marginTop: Spacing.sm,
  },
});
