import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTradingData } from './hooks/useTradingData';
import {
  StockDetailHeader,
  ChartSection,
  TradingButtons,
} from './components';
import MainHeader from '../../components/MainHeader';
import { useTranslation } from '../../language';
import {
  fetchStockDetail,
  fetchStockTechnicalIndicators,
  fetchStockPriceHistory,
  fetchStocks,
  fetchStockNews,
  fetchStockRecentTrades,
} from './utils/tradingApi';

const { width } = Dimensions.get('window');

// Define navigation types
type RootStackParamList = {
  PlaceOrder: { stockSymbol: string; stockName: string; currentPrice: number };
  Home: undefined;
  StockDetail: { stockSymbol: string; stockName: string };
  Trading: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const StockDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'StockDetail'>>();
  const { stockSymbol, stockName } = route.params;
  const { t } = useTranslation();
  const { toggleFavorite } = useTradingData();

  const [loading, setLoading] = useState(true);
  const [stockId, setStockId] = useState<number | null>(null);
  const [stockData, setStockData] = useState<any>(null);
  const [technicalIndicators, setTechnicalIndicators] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Find stock ID by symbol
      const stocks = await fetchStocks();
      const foundStock = stocks.find((s: any) => s.symbol === stockSymbol);

      if (!foundStock) {
        console.warn(`Stock ${stockSymbol} not found in backend`);
        return;
      }

      const sid = foundStock.id;
      setStockId(sid);

      // 2. Fetch detail, indicators, history, news, recent trades in parallel
      const [detail, indicators, history, newsData, tradesData] = await Promise.all([
        fetchStockDetail(sid),
        fetchStockTechnicalIndicators(sid),
        fetchStockPriceHistory(sid, 30),
        fetchStockNews(sid).catch(() => []),
        fetchStockRecentTrades(sid, 5).catch(() => []),
      ]);

      setStockData(detail);
      setTechnicalIndicators(indicators);
      setPriceHistory(history);
      setNews(newsData);
      setRecentTrades(tradesData);
    } catch (error) {
      console.error('Error loading stock detail data:', error);
    } finally {
      setLoading(false);
    }
  }, [stockSymbol]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Derived metrics from stockData
  const marketData = stockData?.market_data || {};
  const currentPrice = Number(marketData?.current_price ?? stockData?.current_price ?? 0);

  const tradingMetrics = {
    open: marketData?.open_24h != null ? `₹${Number(marketData.open_24h).toFixed(2)}` : 'N/A',
    high: marketData?.high_24h != null ? `₹${Number(marketData.high_24h).toFixed(2)}` : 'N/A',
    low: marketData?.low_24h != null ? `₹${Number(marketData.low_24h).toFixed(2)}` : 'N/A',
    prevClose: marketData?.previous_close != null ? `₹${Number(marketData.previous_close).toFixed(2)}` : 'N/A',
    volume: marketData?.volume ? `${(Number(marketData.volume) / 1000000).toFixed(1)}M` : 'N/A',
    avgVolume: stockData?.avg_volume != null ? `${(Number(stockData.avg_volume) / 1000000).toFixed(1)}M` : 'N/A',
    marketCap: marketData?.market_cap != null
      ? `₹${(Number(marketData.market_cap) / 1000000000000).toFixed(1)}T`
      : (stockData?.market_cap != null ? `₹${(Number(stockData.market_cap) / 1000000000000).toFixed(1)}T` : 'N/A'),
    peRatio: marketData?.pe_ratio != null ? String(marketData.pe_ratio) : 'N/A',
    dividendYield: marketData?.dividend_yield != null ? `${Number(marketData.dividend_yield).toFixed(2)}%` : 'N/A',
    beta: stockData?.beta != null ? String(stockData.beta) : 'N/A',
  };

  const stock = {
    symbol: stockSymbol,
    name: stockData?.name || stockName,
    price: `₹${currentPrice.toLocaleString()}`,
    change: `${Number(marketData?.change_percentage ?? 0) >= 0 ? '+' : ''}${Number(marketData?.change_percentage ?? 0).toFixed(2)}%`,
    changeValue: `${Number(marketData?.change_amount ?? 0) >= 0 ? '+' : ''}${Number(marketData?.change_amount ?? 0).toFixed(2)}`,
    isPositive: Number(marketData?.change_percentage ?? 0) >= 0,
    exchange: stockData?.exchange || 'NSE',
    isFavorite: false,
    volume: tradingMetrics.volume,
    marketCap: tradingMetrics.marketCap,
  };

  // Map backend TechnicalIndicator to UI shape
  const signalColor = (signal: string): string => {
    const s = (signal || '').toLowerCase();
    if (s === 'bullish') return '#10B981';
    if (s === 'bearish') return '#EF4444';
    return '#6B7280';
  };
  const mappedIndicators = technicalIndicators.map((ind: any) => ({
    name: ind.indicator_name,
    value: ind.value != null ? String(ind.value) : 'N/A',
    status: ind.signal || 'Neutral',
    color: signalColor(ind.signal),
  }));

  // Fundamentals come from serializer (if present), else fall back to empty
  const fundamentals = (stockData?.fundamentals && stockData.fundamentals.length > 0)
    ? stockData.fundamentals
    : [];

  const handleBack = () => {
    navigation.navigate('Trading');
  };

  const handleToggleBookmark = async () => {
    if (!stockId) return;
    const newState = await toggleFavorite(stockId);
    setIsBookmarked(newState);
    Alert.alert(
      newState ? t.addedToBookmarks : t.removedFromBookmarks,
      `${stock.symbol} ${newState ? t.hasBeenAdded : t.hasBeenRemoved} ${t.yourBookmarks}`
    );
  };

  const handleShare = () => {
    Alert.alert(t.share, (t.sharingStockDetails as string).replace('{symbol}', stock.symbol));
  };

  const handleBuy = () => {
    navigation.navigate('PlaceOrder', {
      stockSymbol: stock.symbol,
      stockName: stock.name,
      currentPrice,
    });
  };

  const handleSell = () => {
    Alert.alert(
      t.sellStock,
      (t.areYouSureSell as string).replace('{symbol}', stock.symbol),
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.sell,
          onPress: () => {
            navigation.navigate('PlaceOrder', {
              stockSymbol: stock.symbol,
              stockName: stock.name,
              currentPrice,
              initialSide: 'SELL'
            });
          }
        }
      ]
    );
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // (selectedFilter kept for backward compat with ChartSection prop, currently unused)
  void selectedFilter;

  const renderTradingMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>{t.tradingMetrics}</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.open}</Text>
          <Text style={styles.metricValue}>{tradingMetrics.open}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.high}</Text>
          <Text style={[styles.metricValue, { color: '#10B981' }]}>{tradingMetrics.high}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.low}</Text>
          <Text style={[styles.metricValue, { color: '#EF4444' }]}>{tradingMetrics.low}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.prevClose}</Text>
          <Text style={styles.metricValue}>{tradingMetrics.prevClose}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.volume}</Text>
          <Text style={styles.metricValue}>{tradingMetrics.volume}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.avgVolume}</Text>
          <Text style={styles.metricValue}>{tradingMetrics.avgVolume}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.marketCap}</Text>
          <Text style={styles.metricValue}>{tradingMetrics.marketCap}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{t.peRatio}</Text>
          <Text style={styles.metricValue}>{tradingMetrics.peRatio}</Text>
        </View>
      </View>
    </View>
  );

  const renderTechnicalIndicators = () => (
    <View style={styles.indicatorsContainer}>
      <Text style={styles.sectionTitle}>{t.technicalIndicators}</Text>
      {mappedIndicators.length === 0 ? (
        <Text style={styles.emptyText}>{t.noIndicatorsAvailable ?? 'No technical indicators available'}</Text>
      ) : (
        <View style={styles.indicatorsGrid}>
          {mappedIndicators.map((indicator, index) => (
            <View key={`${indicator.name}-${index}`} style={styles.indicatorItem}>
              <View style={styles.indicatorHeader}>
                <Text style={styles.indicatorName}>{indicator.name}</Text>
                <View style={[styles.statusDot, { backgroundColor: indicator.color }]} />
              </View>
              <Text style={[styles.indicatorValue, { color: indicator.color }]}>
                {indicator.value}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderRecentTrades = () => (
    <View style={styles.tradesContainer}>
      <Text style={styles.sectionTitle}>{t.recentTrades}</Text>
      {recentTrades.length === 0 ? (
        <Text style={styles.emptyText}>{t.noTradesYet ?? 'No recent trades'}</Text>
      ) : (
        <View style={styles.tradesList}>
          {recentTrades.map((trade: any, index) => {
            const side = (trade.side || trade.type || 'BUY').toString().toUpperCase();
            const price = trade.price != null ? `₹${Number(trade.price).toFixed(2)}` : 'N/A';
            const qty = trade.quantity ?? trade.shares ?? '—';
            const time = trade.executed_at
              ? new Date(trade.executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : (trade.time || '—');
            return (
              <View key={trade.id ?? index} style={styles.tradeItem}>
                <View style={styles.tradeLeft}>
                  <Text style={styles.tradeTime}>{time}</Text>
                  <Text style={styles.tradeQuantity}>{qty} {t.shares}</Text>
                </View>
                <View style={styles.tradeRight}>
                  <Text style={styles.tradePrice}>{price}</Text>
                  <View style={[
                    styles.tradeType,
                    { backgroundColor: side === 'BUY' ? '#DCFCE7' : '#FEE2E2' }
                  ]}>
                    <Text style={[
                      styles.tradeTypeText,
                      { color: side === 'BUY' ? '#10B981' : '#EF4444' }
                    ]}>
                      {side}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  const renderCompanyProfile = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="business" size={20} color="#3B82F6" />
        <Text style={styles.sectionTitle}>{t.companyProfile}</Text>
      </View>
      <Text style={styles.description}>
        {stockData?.description || (t.noCompanyInfo ?? 'No company information available yet.')}
      </Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="calendar" size={16} color="#6B7280" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t.founded}</Text>
            <Text style={styles.infoValue}>{stockData?.founded ?? 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="people" size={16} color="#6B7280" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t.employees}</Text>
            <Text style={styles.infoValue}>{stockData?.employees ?? 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="location" size={16} color="#6B7280" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t.headquarters ?? 'Headquarters'}</Text>
            <Text style={styles.infoValue}>{stockData?.headquarters ?? 'N/A'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNewsHighlights = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="newspaper" size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>{t.newsHighlights}</Text>
      </View>
      {news.length === 0 ? (
        <Text style={styles.emptyText}>{t.noNewsYet ?? 'No news available for this stock'}</Text>
      ) : (
        <View style={styles.newsList}>
          {news.map((newsItem: any) => (
            <View key={newsItem.id} style={styles.newsItem}>
              <View style={styles.newsImage}>
                <Ionicons name="newspaper" size={20} color="#9CA3AF" />
              </View>
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {newsItem.title}
                </Text>
                <View style={styles.newsMeta}>
                  <Ionicons name="time" size={12} color="#9CA3AF" />
                  <Text style={styles.newsMetaText}>
                    {newsItem.time_ago ?? newsItem.timeAgo ?? ''}{newsItem.source ? ` • ${newsItem.source}` : ''}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderKeyFundamentals = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="analytics" size={20} color="#F59E0B" />
        <Text style={styles.sectionTitle}>{t.keyFundamentals}</Text>
      </View>
      {fundamentals.length === 0 ? (
        <Text style={styles.emptyText}>{t.noFundamentals ?? 'No fundamental data available'}</Text>
      ) : (
        <View style={styles.fundamentalsGrid}>
          {fundamentals.map((fundamental: any, index: number) => (
            <View key={`${fundamental.label}-${index}`} style={styles.fundamentalItem}>
              <View style={styles.fundamentalIconContainer}>
                <Ionicons name="trending-up" size={16} color="#3B82F6" />
              </View>
              <View style={styles.fundamentalContent}>
                <Text style={styles.fundamentalLabel}>{fundamental.label}</Text>
                <Text style={styles.fundamentalValue}>{fundamental.value}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={stock.name} iconName="trending-up" showBackButton onBackPress={handleBack} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Chart Section */}
        <ChartSection
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={handleTimeframeChange}
          priceHistory={priceHistory}
        />

        {/* Trading Metrics */}
        {renderTradingMetrics()}

        {/* Technical Indicators */}
        {renderTechnicalIndicators()}

        {/* Recent Trades */}
        {renderRecentTrades()}

        {/* Company Profile */}
        {renderCompanyProfile()}

        {/* News Highlights */}
        {renderNewsHighlights()}

        {/* Key Fundamentals */}
        {renderKeyFundamentals()}

        {/* Bottom spacing for trading buttons */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TradingButtons onBuy={handleBuy} onSell={handleSell} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  sections: {
    marginTop: 1, // Small gap between sections
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 16,
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  newsList: {
    gap: 12,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  newsImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsContent: {
    flex: 1,
    marginRight: 10,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsMetaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  fundamentalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  fundamentalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  fundamentalIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fundamentalContent: {
    flex: 1,
  },
  fundamentalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  fundamentalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  bottomSpacing: {
    height: 100, // Space for trading buttons
  },
  metricsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%', // Two columns
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  indicatorsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indicatorItem: {
    width: '48%', // Two columns
    marginBottom: 12,
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tradesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tradesList: {
    gap: 8,
  },
  tradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  tradeLeft: {
    flex: 1,
  },
  tradeTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  tradeQuantity: {
    fontSize: 12,
    color: '#111827',
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  tradeType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tradeTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default StockDetailScreen;
