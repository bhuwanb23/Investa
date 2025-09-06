import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
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
  const { getStockBySymbol } = useTradingData();
  const { t } = useTranslation();
  
  // Debug log to verify language is working
  console.log('StockDetailScreen - Selected Language:', t.language);

  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Get stock data from the hook
  const stock = getStockBySymbol(stockSymbol) || {
    symbol: stockSymbol,
    name: stockName,
    price: '₹2,456.80',
    change: '+2.45%',
    changeValue: '+58.75',
    isPositive: true,
    exchange: 'NSE',
    isFavorite: false,
    volume: '2.5M',
    marketCap: '₹16.2T',
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
    const currentPrice = parseFloat(stock.price.replace('₹', '').replace(',', ''));
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
        { text: t.sell, onPress: () => console.log('Sell stock') }
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

  // Mock data for enhanced trading information
  const tradingMetrics = {
    open: '₹2,398.05',
    high: '₹2,478.90',
    low: '₹2,385.20',
    prevClose: '₹2,398.05',
    volume: '2.5M',
    avgVolume: '3.1M',
    marketCap: '₹16.2T',
    peRatio: '18.45',
    dividendYield: '0.85%',
    beta: '1.24',
  };

  const technicalIndicators = [
    { name: 'RSI', value: '65.4', status: 'neutral', color: '#F59E0B' },
    { name: 'MACD', value: 'Bullish', status: 'bullish', color: '#10B981' },
    { name: 'Moving Avg', value: 'Above 50MA', status: 'bullish', color: '#10B981' },
    { name: 'Support', value: '₹2,380', status: 'neutral', color: '#6B7280' },
    { name: 'Resistance', value: '₹2,500', status: 'neutral', color: '#6B7280' },
  ];

  const recentTrades = [
    { time: '15:30', price: '₹2,456.80', quantity: '100', type: 'BUY' },
    { time: '15:28', price: '₹2,455.50', quantity: '250', type: 'SELL' },
    { time: '15:25', price: '₹2,457.20', quantity: '75', type: 'BUY' },
    { time: '15:22', price: '₹2,454.90', quantity: '300', type: 'SELL' },
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
        {technicalIndicators.map((indicator, index) => (
          <View key={index} style={styles.indicatorItem}>
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
        {STOCK_DETAIL_DATA.companyProfile.description}
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
        {STOCK_DETAIL_DATA.fundamentals.map((fundamental, index) => (
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
