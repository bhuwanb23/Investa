import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

const TradingScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Trading</Text>
            <Text style={styles.subtitle}>Practice and track your simulated trades</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Balance</Text>
              <Text style={styles.kpiValue}>$12,540</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>P/L Today</Text>
              <Text style={[styles.kpiValue, { color: '#16a34a' }]}>+ $240</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={[styles.tradeBtn, { backgroundColor: '#22c55e' }]} android_ripple={{ color: '#16a34a' }}>
              <Ionicons name="arrow-up" size={16} color="#fff" />
              <Text style={styles.tradeBtnText}>Buy</Text>
            </Pressable>
            <Pressable style={[styles.tradeBtn, { backgroundColor: '#ef4444' }]} android_ripple={{ color: '#dc2626' }}>
              <Ionicons name="arrow-down" size={16} color="#fff" />
              <Text style={styles.tradeBtnText}>Sell</Text>
            </Pressable>
          </View>

          <View style={styles.positionsCard}>
            <Text style={styles.sectionTitle}>Open Positions</Text>
            {[{ s: 'AAPL', qty: 10, price: 189.23, pl: 12.4 }, { s: 'TSLA', qty: 3, price: 244.18, pl: -6.1 }].map((p, idx) => (
              <View key={idx} style={styles.positionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.positionSymbol}>{p.s}</Text>
                  <Text style={styles.positionMeta}>{p.qty} shares • ${p.price.toFixed(2)}</Text>
                </View>
                <Text style={[styles.positionPL, { color: p.pl >= 0 ? '#16a34a' : '#ef4444' }]}>{p.pl >= 0 ? '+' : ''}{p.pl}%</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  subtitle: {
    marginTop: 4,
    color: TEXT_MUTED,
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginRight: 8,
  },
  kpiLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 6,
  },
  kpiValue: {
    color: TEXT_DARK,
    fontSize: 18,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  tradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
  },
  tradeBtnText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 6,
  },
  positionsCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginBottom: 8,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  positionSymbol: {
    color: TEXT_DARK,
    fontWeight: '800',
    fontSize: 14,
  },
  positionMeta: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  positionPL: {
    fontSize: 13,
    fontWeight: '800',
  },
});

export default TradingScreen;
