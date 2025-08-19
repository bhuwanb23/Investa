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
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const SUCCESS = '#16a34a';
const DANGER = '#ef4444';
const CARD_BG = '#ffffff';
const CARD_BORDER = '#e5e7eb';

// Define navigation types
type RootStackParamList = {
  MarketWatchlist: undefined;
  StockDetail: { stockSymbol: string; stockName: string };
  PlaceOrder: { stockSymbol: string; stockName: string; currentPrice: number };
  Portfolio: undefined;
  OrderHistory: undefined;
  Leaderboard: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
};

const TradingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const sparklineHeights = [8, 12, 9, 14, 10, 16, 20, 18, 22, 24, 20, 26, 28, 24, 30];
  const marketIndices = [
    { name: 'S&P 500', value: '5,247', changePct: +0.72 },
    { name: 'NASDAQ', value: '16,142', changePct: -0.31 },
    { name: 'DOW', value: '39,518', changePct: +0.12 },
  ];
  const watchlist = [
    { s: 'AAPL', name: 'Apple', price: 189.23, changePct: +1.2 },
    { s: 'TSLA', name: 'Tesla', price: 244.18, changePct: -0.8 },
    { s: 'NVDA', name: 'Nvidia', price: 876.54, changePct: +2.4 },
    { s: 'AMZN', name: 'Amazon', price: 172.35, changePct: +0.3 },
  ];
  const topMovers = [
    { s: 'PLTR', price: 26.41, changePct: +8.3 },
    { s: 'COIN', price: 236.12, changePct: +6.1 },
    { s: 'UBER', price: 73.55, changePct: -4.2 },
    { s: 'SQ', price: 78.02, changePct: -3.5 },
  ];
  const recentActivity = [
    { id: 1, type: 'Buy', s: 'AAPL', qty: 5, price: 188.4, time: 'Today, 10:24' },
    { id: 2, type: 'Sell', s: 'TSLA', qty: 2, price: 246.2, time: 'Yesterday, 15:12' },
    { id: 3, type: 'Buy', s: 'NVDA', qty: 1, price: 862.0, time: 'Mon, 11:00' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <MainHeader title="Trading" iconName="trending-up" onNotificationsPress={() => navigation.navigate('OrderHistory')} onProfilePress={() => navigation.navigate('Portfolio')} />

          {/* Sections (Navigation) */}
          <View style={styles.sectionsRow}>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('MarketWatchlist')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="trending-up" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>Market</Text>
            </Pressable>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('Portfolio')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="pie-chart" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>Portfolio</Text>
            </Pressable>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('OrderHistory')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="time" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>History</Text>
            </Pressable>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('Leaderboard')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="trophy" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>Leaders</Text>
            </Pressable>
          </View>

          {/* Portfolio Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.kpiLabel}>Portfolio Value</Text>
                <Text style={styles.overviewValue}>$12,540.00</Text>
              </View>
              <View style={styles.plPillPositive}>
                <Ionicons name="trending-up" size={14} color="#fff" />
                <Text style={styles.plPillText}>+$240 (1.95%)</Text>
              </View>
            </View>
            <View style={styles.sparklineRow}>
              {sparklineHeights.map((h, i) => (
                <View key={i} style={[styles.sparkBar, { height: h }]} />
              ))}
            </View>
            <View style={styles.overviewStatsRow}>
              <View style={styles.overviewStat}>
                <Text style={styles.kpiLabel}>Cash</Text>
                <Text style={styles.kpiValue}>$2,140</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.kpiLabel}>Invested</Text>
                <Text style={styles.kpiValue}>$10,400</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.kpiLabel}>Positions</Text>
                <Text style={styles.kpiValue}>6</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <Pressable
              style={[styles.quickActionCard, { backgroundColor: '#22c55e' }]}
              android_ripple={{ color: '#16a34a' }}
              onPress={() => navigation.navigate('PlaceOrder', { stockSymbol: 'AAPL', stockName: 'Apple', currentPrice: 189.23 })}
            >
              <Ionicons name="arrow-up" size={18} color="#fff" />
              <Text style={styles.quickActionText}>Buy</Text>
            </Pressable>
            <Pressable
              style={[styles.quickActionCard, { backgroundColor: '#ef4444' }]}
              android_ripple={{ color: '#dc2626' }}
              onPress={() => navigation.navigate('PlaceOrder', { stockSymbol: 'TSLA', stockName: 'Tesla', currentPrice: 244.18 })}
            >
              <Ionicons name="arrow-down" size={18} color="#fff" />
              <Text style={styles.quickActionText}>Sell</Text>
            </Pressable>
            <Pressable
              style={[styles.quickActionCard, { backgroundColor: PRIMARY }]}
              android_ripple={{ color: '#4338ca' }}
              onPress={() => navigation.navigate('MarketWatchlist')}
            >
              <Ionicons name="search" size={18} color="#fff" />
              <Text style={styles.quickActionText}>Explore</Text>
            </Pressable>
            <Pressable
              style={[styles.quickActionCard, { backgroundColor: '#06b6d4' }]}
              android_ripple={{ color: '#0891b2' }}
              onPress={() => navigation.navigate('Portfolio')}
            >
              <Ionicons name="wallet" size={18} color="#fff" />
              <Text style={styles.quickActionText}>Portfolio</Text>
            </Pressable>
          </View>

          {/* Market Overview */}
          <View style={styles.marketSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Market Overview</Text>
              <Pressable onPress={() => navigation.navigate('MarketWatchlist')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>See all</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketChipsRow}>
              {marketIndices.map((m, idx) => (
                <View key={idx} style={styles.marketChip}>
                  <Text style={styles.marketChipTitle}>{m.name}</Text>
                  <Text style={styles.marketChipValue}>{m.value}</Text>
                  <Text style={[styles.marketChipChange, { color: m.changePct >= 0 ? SUCCESS : DANGER }]}>
                    {m.changePct >= 0 ? '+' : ''}{m.changePct}%
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Watchlist */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Watchlist</Text>
              <Pressable onPress={() => navigation.navigate('MarketWatchlist')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>Edit</Text>
              </Pressable>
            </View>
            {watchlist.map((w, idx) => (
              <Pressable key={idx} style={styles.watchRow} onPress={() => navigation.navigate('StockDetail', { stockSymbol: w.s, stockName: w.name })} android_ripple={{ color: '#f3f4f6' }}>
                <View style={styles.symbolBadge}>
                  <Text style={styles.symbolBadgeText}>{w.s}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.symbolName}>{w.name}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.min(100, Math.abs(w.changePct) * 10)}%`, backgroundColor: w.changePct >= 0 ? SUCCESS : DANGER }]} />
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.priceText}>${w.price.toFixed(2)}</Text>
                  <Text style={[styles.changeText, { color: w.changePct >= 0 ? SUCCESS : DANGER }]}>
                    {w.changePct >= 0 ? '+' : ''}{w.changePct}%
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Top Movers */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Top Movers</Text>
            <View style={styles.moversGrid}>
              {topMovers.map((m, idx) => (
                <Pressable key={idx} style={styles.moverCard} onPress={() => navigation.navigate('StockDetail', { stockSymbol: m.s, stockName: m.s })} android_ripple={{ color: '#e5e7eb' }}>
                  <View style={styles.moverHeader}>
                    <Text style={styles.moverSymbol}>{m.s}</Text>
                    <Text style={[styles.moverChange, { color: m.changePct >= 0 ? SUCCESS : DANGER }]}>
                      {m.changePct >= 0 ? '+' : ''}{m.changePct}%
                    </Text>
                  </View>
                  <Text style={styles.moverPrice}>${m.price.toFixed(2)}</Text>
                  <View style={styles.miniSparkRow}>
                    {[6, 9, 7, 10, 8, 12, 11].map((h, i) => (
                      <View key={i} style={[styles.miniBar, { height: h, backgroundColor: m.changePct >= 0 ? SUCCESS : DANGER }]} />
                    ))}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Open Positions */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Open Positions</Text>
              <Pressable onPress={() => navigation.navigate('Portfolio')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>Manage</Text>
              </Pressable>
            </View>
            {[{ s: 'AAPL', qty: 10, price: 189.23, pl: 12.4 }, { s: 'TSLA', qty: 3, price: 244.18, pl: -6.1 }].map((p, idx) => (
              <View key={idx} style={styles.positionRow}>
                <View style={styles.positionLeft}>
                  <View style={styles.symbolBadgeSmall}>
                    <Text style={styles.symbolBadgeSmallText}>{p.s}</Text>
                  </View>
                  <View>
                    <Text style={styles.positionSymbol}>{p.s}</Text>
                    <Text style={styles.positionMeta}>{p.qty} shares • ${p.price.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.positionPL, { color: p.pl >= 0 ? SUCCESS : DANGER }]}>{p.pl >= 0 ? '+' : ''}{p.pl}%</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Leaderboard Preview */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Leaderboard Preview</Text>
              <Pressable onPress={() => navigation.navigate('Leaderboard')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>View all</Text>
              </Pressable>
            </View>
            {[
              { rank: 1, user: 'Ava', pnl: +24.3 },
              { rank: 2, user: 'Liam', pnl: +18.7 },
              { rank: 3, user: 'Noah', pnl: +15.2 },
            ].map((u, idx) => (
              <View key={idx} style={styles.leaderRow}>
                <Text style={styles.leaderRank}>#{u.rank}</Text>
                <Text style={styles.leaderName}>{u.user}</Text>
                <Text style={[styles.leaderPnl, { color: SUCCESS }]}>+{u.pnl}%</Text>
              </View>
            ))}
          </View>

          {/* Recent Activity */}
          <View style={[styles.card, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentActivity.map((a) => (
              <View key={a.id} style={styles.activityRow}>
                <View style={styles.activityIcon}>
                  <Ionicons name={a.type === 'Buy' ? 'arrow-up' : 'arrow-down'} size={14} color={a.type === 'Buy' ? SUCCESS : DANGER} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityText}>{a.type} {a.qty} {a.s} @ ${a.price.toFixed(2)}</Text>
                  <Text style={styles.activityTime}>{a.time}</Text>
                </View>
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
  sectionTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerActionText: {
    color: PRIMARY,
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 12,
  },
  overviewCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewValue: {
    color: TEXT_DARK,
    fontSize: 22,
    fontWeight: '900',
  },
  plPillPositive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SUCCESS,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  plPillText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 12,
  },
  sparklineRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 10,
  },
  sparkBar: {
    width: 8,
    borderRadius: 3,
    backgroundColor: PRIMARY,
    marginRight: 4,
  },
  overviewStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    flex: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionCard: {
    width: '24%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    marginTop: 6,
  },
  marketSection: {
    marginTop: 16,
  },
  sectionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionCard: {
    width: '24%',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    marginTop: 8,
    color: TEXT_DARK,
    fontWeight: '800',
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  linkText: {
    color: PRIMARY,
    fontWeight: '800',
    fontSize: 12,
  },
  marketChipsRow: {
    paddingVertical: 4,
  },
  marketChip: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 130,
  },
  marketChipTitle: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  marketChipValue: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginTop: 4,
    fontSize: 16,
  },
  marketChipChange: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  symbolBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  symbolBadgeText: {
    color: PRIMARY,
    fontWeight: '900',
  },
  symbolName: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginBottom: 6,
  },
  progressTrack: {
    width: 120,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  priceText: {
    color: TEXT_DARK,
    fontWeight: '900',
  },
  changeText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '800',
  },
  moversGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moverCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  moverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moverSymbol: {
    color: TEXT_DARK,
    fontWeight: '900',
  },
  moverChange: {
    fontWeight: '800',
    fontSize: 12,
  },
  moverPrice: {
    marginTop: 8,
    color: TEXT_DARK,
    fontWeight: '800',
  },
  miniSparkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  miniBar: {
    width: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  positionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolBadgeSmall: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  symbolBadgeSmallText: {
    color: PRIMARY,
    fontWeight: '900',
    fontSize: 12,
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
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  leaderRank: {
    color: TEXT_MUTED,
    width: 28,
    fontWeight: '800',
  },
  leaderName: {
    color: TEXT_DARK,
    fontWeight: '800',
    flex: 1,
  },
  leaderPnl: {
    fontWeight: '900',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityText: {
    color: TEXT_DARK,
    fontWeight: '800',
  },
  activityTime: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
});

export default TradingScreen;
