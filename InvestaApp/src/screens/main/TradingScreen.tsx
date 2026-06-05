import React, { useState, useEffect } from 'react';
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
import LogoLoader from '../../components/LogoLoader';
import {
  fetchMyPortfolio,
  fetchPortfolioHoldings,
  fetchOrderHistory,
  fetchStocks,
  fetchMyWatchlist,
  fetchMarketTopMovers,
  fetchMarketIndices,
  fetchLeaderboard,
} from '../trading/utils/tradingApi';
import { useTranslation } from '../../language';

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
  const { t } = useTranslation();
  
  // State for real data
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [marketIndices, setMarketIndices] = useState<any[]>([]);
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bootLoader, setBootLoader] = useState(true);

  // Debug log to verify language is working

  // Fetch real data on component mount
  useEffect(() => {
    const t = setTimeout(() => setBootLoader(false), 800);
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [portfolioRes, holdingsRes, ordersRes, stocksRes, indicesRes, moversRes, leaderboardRes] = await Promise.all([
          fetchMyPortfolio(),
          fetchPortfolioHoldings(),
          fetchOrderHistory(),
          fetchStocks(),
          fetchMarketIndices().catch(() => []),
          fetchMarketTopMovers().catch(() => ({ top_gainers: [], top_losers: [] })),
          fetchLeaderboard('all').catch(() => []),
        ]);

        if (!mounted) return;

        setPortfolioData(portfolioRes);
        setHoldings(holdingsRes);
        setOrders(ordersRes);
        setStocks(stocksRes);
        setWatchlist(stocksRes.slice(0, 4));
        setMarketIndices(Array.isArray(indicesRes) ? indicesRes : []);
        setTopGainers(moversRes?.top_gainers ?? []);
        setTopLosers(moversRes?.top_losers ?? []);
        setLeaderboard(Array.isArray(leaderboardRes) ? leaderboardRes.slice(0, 5) : []);
      } catch (error) {
        console.error('TradingScreen: Error fetching data:', error);
        if (mounted) {
          setPortfolioData(null);
          setHoldings([]);
          setOrders([]);
          setStocks([]);
          setWatchlist([]);
          setMarketIndices([]);
          setTopGainers([]);
          setTopLosers([]);
          setLeaderboard([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; clearTimeout(t); };
  }, []);

  // Calculate portfolio statistics from real data
  const totalValue = Number(portfolioData?.total_value) || 0;
  const totalInvested = Number(portfolioData?.total_invested) || 0;
  const totalReturns = totalValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : '0.0';

  // Sparkline derived from first watchlist stock's price history would be ideal;
  // for now render a simple static shape when portfolio has value, empty otherwise.
  const sparklineHeights = totalValue > 0
    ? [8, 12, 9, 14, 10, 16, 20, 18, 22, 24, 20, 26, 28, 24, 30]
    : [];

  // Format a real order timestamp into a friendly string
  const formatActivityTime = (ts: string | undefined): string => {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const sameYesterday = d.toDateString() === yesterday.toDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (sameDay) return `${t.today ?? 'Today'}, ${time}`;
    if (sameYesterday) return `${t.yesterday ?? 'Yesterday'}, ${time}`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get recent activity from real orders
  const recentActivity = orders.slice(0, 3).map((order, index) => ({
    id: order.id || index + 1,
    type: (order.side || order.type || 'BUY').toString().toUpperCase(),
    s: order.stock_detail?.symbol || order.stock?.symbol || 'N/A',
    qty: Number(order.quantity) || 0,
    price: Number(order.price) || 0,
    time: formatActivityTime(order.created_at || order.executed_at),
  }));

  // Combined movers list (gainers first, then losers, capped at 4)
  const combinedMovers = [
    ...topGainers.map((m: any) => ({ ...m, _dir: 'gainer' })),
    ...topLosers.map((m: any) => ({ ...m, _dir: 'loser' })),
  ].slice(0, 4);

  // Top 3 leaders
  const topLeaders = leaderboard.slice(0, 3);

  if (bootLoader) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <LogoLoader message="Loading Investa..." fullscreen />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollContent, styles.fullWidth]} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
          <MainHeader title={t.title} iconName="trending-up" onNotificationsPress={() => navigation.navigate('OrderHistory')} />
          <View style={styles.pagePadding}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>{t.loadingMessage}</Text>
              </View>
            ) : (
              <>
                {/* Sections (Navigation) */}
                <View style={styles.sectionsRow}>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('MarketWatchlist')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="trending-up" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>{t.market}</Text>
            </Pressable>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('Portfolio')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="pie-chart" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>{t.portfolio}</Text>
            </Pressable>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('OrderHistory')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="time" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>{t.history}</Text>
            </Pressable>
            <Pressable style={styles.sectionCard} onPress={() => navigation.navigate('Leaderboard')} android_ripple={{ color: '#e5e7eb' }}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="trophy" size={18} color={PRIMARY} />
              </View>
              <Text style={styles.sectionLabel}>{t.leaders}</Text>
            </Pressable>
          </View>

          {/* Portfolio Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.kpiLabel}>{t.portfolioValue}</Text>
                <Text style={styles.overviewValue}>₹{totalValue.toLocaleString()}</Text>
              </View>
              <View style={[
                styles.plPillPositive,
                { backgroundColor: totalReturns >= 0 ? SUCCESS : DANGER }
              ]}>
                <Ionicons 
                  name={totalReturns >= 0 ? "trending-up" : "trending-down"} 
                  size={14} 
                  color="#fff" 
                />
                <Text style={styles.plPillText}>
                  {totalReturns >= 0 ? '+' : ''}₹{totalReturns.toLocaleString()} ({returnPercentage}%)
                </Text>
              </View>
            </View>
            <View style={styles.sparklineRow}>
              {sparklineHeights.map((h, i) => (
                <View key={i} style={[styles.sparkBar, { height: h }]} />
              ))}
            </View>
            <View style={styles.overviewStatsRow}>
              <View style={styles.overviewStat}>
                <Text style={styles.kpiLabel}>{t.cash}</Text>
                <Text style={styles.kpiValue}>₹{(totalValue - totalInvested).toLocaleString()}</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.kpiLabel}>{t.invested}</Text>
                <Text style={styles.kpiValue}>₹{totalInvested.toLocaleString()}</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.kpiLabel}>{t.positions}</Text>
                <Text style={styles.kpiValue}>{holdings.length}</Text>
              </View>
            </View>
          </View>

          {/* Market Overview */}
          <View style={styles.marketSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t.marketOverview}</Text>
              <Pressable onPress={() => navigation.navigate('MarketWatchlist')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>{t.seeAll}</Text>
              </Pressable>
            </View>
            {marketIndices.length === 0 ? (
              <View style={styles.emptyWatchlist}>
                <Text style={styles.emptyText}>{t.noIndicesAvailable ?? 'No market data available'}</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marketChipsRow}>
                {marketIndices.map((m) => {
                  const pct = Number(m.change_percentage ?? 0);
                  return (
                    <View key={m.id ?? m.name} style={styles.marketChip}>
                      <Text style={styles.marketChipTitle}>{m.name}</Text>
                      <Text style={styles.marketChipValue}>{Number(m.value).toLocaleString()}</Text>
                      <Text style={[styles.marketChipChange, { color: pct >= 0 ? SUCCESS : DANGER }]}>
                        {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Watchlist */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t.watchlist}</Text>
              <Pressable onPress={() => navigation.navigate('MarketWatchlist')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>{t.edit}</Text>
              </Pressable>
            </View>
            {watchlist.length > 0 ? watchlist.map((w, idx) => {
              const stock = stocks.find(s => s.id === (w.stock_id ?? w.stock?.id));
              const symbol = stock?.symbol || w.symbol || w.stock?.symbol || 'N/A';
              const name = stock?.name || w.name || w.stock?.name || 'Unknown Stock';
              const price = Number(stock?.current_price ?? w.current_price ?? w.stock?.current_price ?? 0);
              const changePct = Number(stock?.change_percentage ?? w.change_percentage ?? w.stock?.change_percentage ?? 0);

              return (
                <Pressable key={w.id ?? symbol + idx} style={styles.watchRow} onPress={() => navigation.navigate('StockDetail', { stockSymbol: symbol, stockName: name })} android_ripple={{ color: '#f3f4f6' }}>
                  <View style={styles.symbolBadge}>
                    <Text style={styles.symbolBadgeText}>{symbol}</Text>
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.symbolName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.min(100, Math.abs(changePct) * 10)}%`, backgroundColor: changePct >= 0 ? SUCCESS : DANGER }]} />
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', minWidth: 80 }}>
                    <Text style={styles.priceText}>₹{price.toFixed(2)}</Text>
                    <Text style={[styles.changeText, { color: changePct >= 0 ? SUCCESS : DANGER }]}>
                      {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
                    </Text>
                  </View>
                </Pressable>
              );
            }) : (
              <View style={styles.emptyWatchlist}>
                <Text style={styles.emptyText}>{t.noStocksInWatchlist}</Text>
                <Text style={styles.emptySubtext}>{t.addStocksToTrack}</Text>
              </View>
            )}
          </View>

          {/* Top Movers */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t.topMovers}</Text>
            {combinedMovers.length === 0 ? (
              <View style={styles.emptyWatchlist}>
                <Text style={styles.emptyText}>{t.noMoversAvailable ?? 'No top movers data available'}</Text>
              </View>
            ) : (
              <View style={styles.moversGrid}>
                {combinedMovers.map((m: any, idx) => {
                  const s = m.stock || {};
                  const symbol = s.symbol || 'N/A';
                  const name = s.name || symbol;
                  const price = Number(m.current_price ?? s.current_price ?? 0);
                  const changePct = Number(m.change_percentage ?? s.change_percentage ?? 0);
                  return (
                    <Pressable
                      key={`${symbol}-${idx}`}
                      style={styles.moverCard}
                      onPress={() => navigation.navigate('StockDetail', { stockSymbol: symbol, stockName: name })}
                      android_ripple={{ color: '#e5e7eb' }}
                    >
                      <View style={styles.moverHeader}>
                        <Text style={styles.moverSymbol}>{symbol}</Text>
                        <Text style={[styles.moverChange, { color: changePct >= 0 ? SUCCESS : DANGER }]}>
                          {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
                        </Text>
                      </View>
                      <Text style={styles.moverPrice}>₹{price.toFixed(2)}</Text>
                      <View style={styles.miniSparkRow}>
                        {[6, 9, 7, 10, 8, 12, 11].map((h, i) => (
                          <View key={i} style={[styles.miniBar, { height: h, backgroundColor: changePct >= 0 ? SUCCESS : DANGER }]} />
                        ))}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Open Positions */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t.openPositions}</Text>
              <Pressable onPress={() => navigation.navigate('Portfolio')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>{t.manage}</Text>
              </Pressable>
            </View>
            {holdings.length > 0 ? holdings.slice(0, 3).map((holding, idx) => {
              // Find stock details from stocks array
              const stock = stocks.find(s => s.id === holding.stock_id);
              const symbol = stock?.symbol || holding.symbol || 'N/A';
              const currentPrice = Number(holding.current_price) || 0;
              const avgPrice = Number(holding.average_price) || 0;
              const quantity = Number(holding.quantity) || 0;
              const marketValue = currentPrice * quantity;
              const totalCost = avgPrice * quantity;
              const pl = totalCost > 0 ? ((marketValue - totalCost) / totalCost) * 100 : 0;
              
              return (
                <View key={idx} style={styles.positionRow}>
                  <View style={styles.positionLeft}>
                    <View style={styles.symbolBadgeSmall}>
                      <Text style={styles.symbolBadgeSmallText}>{symbol}</Text>
                    </View>
                    <View>
                      <Text style={styles.positionSymbol}>{symbol}</Text>
                      <Text style={styles.positionMeta}>{quantity} {t.shares} • ₹{currentPrice.toFixed(2)}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.positionPL, { color: pl >= 0 ? SUCCESS : DANGER }]}>
                      {pl >= 0 ? '+' : ''}{pl.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              );
            }) : (
              <View style={styles.emptyPositions}>
                <Text style={styles.emptyText}>{t.noOpenPositions}</Text>
                <Text style={styles.emptySubtext}>{t.startTradingToBuild}</Text>
              </View>
            )}
          </View>

          {/* Leaderboard Preview */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t.leaderboardPreview}</Text>
              <Pressable onPress={() => navigation.navigate('Leaderboard')} android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.linkText}>{t.viewAll}</Text>
              </Pressable>
            </View>
            {topLeaders.length === 0 ? (
              <View style={styles.emptyPositions}>
                <Text style={styles.emptyText}>{t.noLeaderboardData ?? 'No leaderboard data available'}</Text>
              </View>
            ) : topLeaders.map((entry: any) => {
              const u = entry.user || {};
              const name = u.first_name
                ? `${u.first_name} ${u.last_name ?? ''}`.trim()
                : (u.username || 'Trader');
              const pnl = Number(entry.total_profit_loss ?? 0);
              const isPos = pnl >= 0;
              return (
                <View key={entry.rank ?? u.id ?? name} style={styles.leaderRow}>
                  <Text style={styles.leaderRank}>#{entry.rank ?? '—'}</Text>
                  <Text style={styles.leaderName}>{name}</Text>
                  <Text style={[styles.leaderPnl, { color: isPos ? SUCCESS : DANGER }]}>
                    {isPos ? '+' : ''}₹{Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Recent Activity */}
          <View style={[styles.card, { marginBottom: 20 }]}>
            <Text style={styles.sectionTitle}>{t.recentActivity}</Text>
            {recentActivity.length > 0 ? recentActivity.map((a) => {
              const isBuy = a.type === 'BUY';
              return (
                <View key={a.id} style={styles.activityRow}>
                  <View style={styles.activityIcon}>
                    <Ionicons
                      name={isBuy ? 'arrow-up' : 'arrow-down'}
                      size={14}
                      color={isBuy ? SUCCESS : DANGER}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityText}>{a.type} {a.qty} {a.s} @ ₹{(Number(a.price) || 0).toFixed(2)}</Text>
                    {a.time ? <Text style={styles.activityTime}>{a.time}</Text> : null}
                  </View>
                </View>
              );
            }) : (
              <View style={styles.emptyActivity}>
                <Text style={styles.emptyText}>{t.noRecentActivity}</Text>
                <Text style={styles.emptySubtext}>{t.startTradingToSee}</Text>
              </View>
            )}
          </View>
                </>
            )}
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
    paddingBottom: 24,
  },
  fullWidth: {
    width: '100%',
  },
  pagePadding: {
    paddingHorizontal: 16,
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
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionCard: {
    width: '48%',
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
    overflow: 'hidden', // Prevent content from overflowing the card boundaries
  },
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingHorizontal: 4, // Add horizontal padding to prevent edge overflow
    minHeight: 60, // Ensure consistent row height
  },
  symbolBadge: {
    width: 48, // Increase width slightly to accommodate longer symbols
    height: 42,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden', // Prevent text from overflowing outside the badge
  },
  symbolBadgeText: {
    color: PRIMARY,
    fontWeight: '900',
    fontSize: 9, // Further reduce font size to ensure text fits
    textAlign: 'center', // Center the text
    includeFontPadding: false, // Remove extra padding on Android
    textAlignVertical: 'center', // Center vertically on Android
    maxWidth: '100%', // Ensure text doesn't exceed badge width
  },
  symbolName: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginBottom: 6,
    flexShrink: 1, // Allow text to shrink if needed
  },
  progressTrack: {
    width: 100, // Reduce width to ensure it fits within the available space
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
  emptyWatchlist: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyPositions: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: TEXT_MUTED,
  },
});

export default TradingScreen;
