import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

/**
 * Reusable empty state placeholder.
 * Use everywhere a list/feed has zero data.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-open-outline',
  title,
  subtitle,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={48} color="#9CA3AF" />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default EmptyState;
