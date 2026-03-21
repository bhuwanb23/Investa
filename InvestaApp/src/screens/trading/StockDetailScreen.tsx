import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTradingData } from './hooks/useTradingData';
import {
  StockDetailHeader,
  ChartSection,
  TradingButtons,
} from './components';
import { STOCK_DETAIL_DATA } from './constants/tradingConstants';
import MainHeader from '../../components/MainHeader';
import { useTranslation } from '../../language';
import { fetchStockDetail, fetchStockTechnicalIndicators, fetchStockPriceHistory, fetchStocks } from './utils/tradingApi';

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
  
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<any>(null);
  const [technicalIndicators, setTechnicalIndicators] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        // 1. Find stock ID by symbol
        const stocks = await fetchStocks();
        const foundStock = stocks.find((s: any) => s.symbol === stockSymbol);
        
        if (foundStock) {
          const stockId = foundStock.id;
          
          // 2. Fetch detail, indicators, and history in parallel
          const [detail, indicators, history] = await Promise.all([
            fetchStockDetail(stockId),
            fetchStockTechnicalIndicators(stockId),
            fetchStockPriceHistory(stockId, 30)
          ]);
          
          setStockData(detail);
          setTechnicalIndicators(indicators);
          setPriceHistory(history);
        } else {
          // Fallback if stock not found in API
          console.warn(`Stock ${stockSymbol} not found in backend`);
        }
      } catch (error) {
        console.error('Error loading stock detail data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [stockSymbol]);

  // Derived metrics from stockData
  const marketData = stockData?.market_data?.[0] || {};
  const currentPrice = marketData?.current_price || 0;
  
  const tradingMetrics = {
    open: `₹${marketData?.open_price || '0.00'}`,
    high: `₹${marketData?.high_price || '0.00'}`,
    low: `₹${marketData?.low_price || '0.00'}`,
    prevClose: `₹${marketData?.prev_close_price || '0.00'}`,
    volume: marketData?.volume ? `${(marketData.volume / 1000000).toFixed(1)}M` : '0.0M',
    avgVolume: '3.1M',
    marketCap: stockData?.market_cap ? `₹${(stockData.market_cap / 1000000000000).toFixed(1)}T` : 'N/A',
    peRatio: stockData?.pe_ratio || 'N/A',
    dividendYield: '0.85%',
    beta: '1.24',
  };

  const stock = {
    symbol: stockSymbol,
    name: stockData?.name || stockName,
    price: `₹${currentPrice.toLocaleString()}`,
    change: `${marketData?.change_percentage >= 0 ? '+' : ''}${marketData?.change_percentage?.toFixed(2)}%`,
    changeValue: `${marketData?.change_amount >= 0 ? '+' : ''}${marketData?.change_amount?.toFixed(2)}`,
    isPositive: marketData?.change_percentage >= 0,
    exchange: stockData?.exchange || 'NSE',
    isFavorite: false,
    volume: tradingMetrics.volume,
    marketCap: tradingMetrics.marketCap,
  };

  const handleBack = () => {
    navigation.navigate('Trading');
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? t.removedFromBookmarks : t.addedToBookmarks,
      `${stock.symbol} ${isBookmarked ? t.hasBeenRemovedFrom : t.hasBeenAddedTo} ${t.yourBookmarks}.`
    );
  };

  const handleShare = () => {
    Alert.alert(t.share, `${t.sharing} ${stock.symbol} ${t.stockDetails}`);
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
      `${t.areYouSureYouWantToSell} ${stock.symbol}?`,
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

  // Filter options for chart
  const filterOptions = [
    t.all,
    t.bullish,
    t.bearish, 
    t.volatile,
    t.thisWeek,
    t.thisMonth,
    t.thisYear
  ];

  const recentTrades = [
    { time: '15:30', price: stock.price, quantity: '100', type: 'BUY' },
    { time: '15:28', price: stock.price, quantity: '250', type: 'SELL' },
    { time: '15:25', price: stock.price, quantity: '75', type: 'BUY' },
    { time: '15:22', price: stock.price, quantity: '300', type: 'SELL' },
  ];

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
      <View style={styles.indicatorsGrid}>
        {(technicalIndicators.length > 0 ? technicalIndicators : [
          { name: 'RSI', value: '65.4', status: 'neutral', color: '#F59E0B' },
          { name: 'MACD', value: 'Bullish', status: 'bullish', color: '#10B981' },
          { name: 'Moving Avg', value: 'Above 50MA', status: 'bullish', color: '#10B981' },
          { name: 'Support', value: '₹2,380', status: 'neutral', color: '#6B7280' },
          { name: 'Resistance', value: '₹2,500', status: 'neutral', color: '#6B7280' },
        ]).map((indicator, index) => (
          <View key={index} style={styles.indicatorItem}>
            <View style={styles.indicatorHeader}>
              <Text style={styles.indicatorName}>{indicator.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: indicator.color || '#6B7280' }]} />
            </View>
            <Text style={[styles.indicatorValue, { color: indicator.color || '#6B7280' }]}>
              {indicator.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRecentTrades = () => (
    <View style={styles.tradesContainer}>
      <Text style={styles.sectionTitle}>{t.recentTrades}</Text>
      <View style={styles.tradesList}>
        {recentTrades.map((trade, index) => (
          <View key={index} style={styles.tradeItem}>
            <View style={styles.tradeLeft}>
              <Text style={styles.tradeTime}>{trade.time}</Text>
              <Text style={styles.tradeQuantity}>{trade.quantity} {t.shares}</Text>
            </View>
            <View style={styles.tradeRight}>
              <Text style={styles.tradePrice}>{trade.price}</Text>
              <View style={[
                styles.tradeType,
                { backgroundColor: trade.type === 'BUY' ? '#DCFCE7' : '#FEE2E2' }
              ]}>
                <Text style={[
                  styles.tradeTypeText,
                  { color: trade.type === 'BUY' ? '#10B981' : '#EF4444' }
                ]}>
                  {trade.type}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCompanyProfile = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="business" size={20} color="#3B82F6" />
        <Text style={styles.sectionTitle}>{t.companyProfile}</Text>
      </View>
      <Text style={styles.description}>
        {stockData?.description || STOCK_DETAIL_DATA.companyProfile.description}
      </Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="calendar" size={16} color="#6B7280" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t.founded}</Text>
            <Text style={styles.infoValue}>{STOCK_DETAIL_DATA.companyProfile.founded}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="people" size={16} color="#6B7280" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t.employees}</Text>
            <Text style={styles.infoValue}>{STOCK_DETAIL_DATA.companyProfile.employees}</Text>
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
      <View style={styles.newsList}>
        {STOCK_DETAIL_DATA.news.map((newsItem) => (
          <View key={newsItem.id} style={styles.newsItem}>
            <View style={styles.newsImage}>
              <Ionicons name="image" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {newsItem.title}
              </Text>
              <View style={styles.newsMeta}>
                <Ionicons name="time" size={12} color="#9CA3AF" />
                <Text style={styles.newsMetaText}>
                  {newsItem.timeAgo} • {newsItem.source}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </View>
        ))}
      </View>
    </View>
  );

  const renderKeyFundamentals = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="analytics" size={20} color="#F59E0B" />
        <Text style={styles.sectionTitle}>{t.keyFundamentals}</Text>
      </View>
      <View style={styles.fundamentalsGrid}>
        {(stockData?.fundamentals || STOCK_DETAIL_DATA.fundamentals).map((fundamental: any, index: number) => (
          <View key={index} style={styles.fundamentalItem}>
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
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
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
