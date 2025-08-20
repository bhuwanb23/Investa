import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, TEXT_DARK, TEXT_MUTED } from '../constants/courseConstants';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

const DetailHeader: React.FC<Props> = ({ title, subtitle, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={20} color={PRIMARY} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    color: TEXT_DARK,
    fontWeight: '800',
    fontSize: 18,
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
});

export default DetailHeader;


