import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// Define navigation types
type RootStackParamList = {
  PlaceOrder: { stockSymbol: string; stockName: string; currentPrice: number };
  Home: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

type RouteProp = {
  params: {
    stockSymbol: string;
    stockName: string;
  };
};

const StockDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { stockSymbol, stockName } = route.params;

  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  // Mock stock data
  const stockData = {
    symbol: stockSymbol,
    name: stockName,
    currentPrice: 245.67,
    change: 12.34,
    changePercent: 5.28,
    previousClose: 233.33,
    open: 235.50,
    high: 248.90,
    low: 234.20,
    volume: 45678900,
    marketCap: 2456700000000,
    peRatio: 28.5,
    dividendYield: 1.2,
    sector: 'Technology',
    industry: 'Software',
    description: 'A leading technology company specializing in cloud computing, artificial intelligence, and digital transformation solutions.',
    employees: 150000,
    founded: 1994,
    headquarters: 'Seattle, WA',
  };

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? '#10B981' : '#EF4444';

  const handleBuyStock = () => {
    navigation.navigate('PlaceOrder', {
      stockSymbol: stockData.symbol,
      stockName: stockData.name,
      currentPrice: stockData.currentPrice,
    });
  };

  const handleSellStock = () => {
    Alert.alert(
      "Sell Stock",
      `Are you sure you want to sell ${stockData.symbol}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sell", onPress: () => console.log("Sell stock") }
      ]
    );
  };

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
    Alert.alert(
      isWatchlisted ? "Removed from Watchlist" : "Added to Watchlist",
      `${stockData.symbol} has been ${isWatchlisted ? 'removed from' : 'added to'} your watchlist.`
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.stockSymbol}>{stockData.symbol}</Text>
        <Text style={styles.stockName}>{stockData.name}</Text>
      </View>
      <TouchableOpacity onPress={toggleWatchlist} style={styles.watchlistButton}>
        <Ionicons 
          name={isWatchlisted ? "star" : "star-outline"} 
          size={24} 
          color={isWatchlisted ? "#F59E0B" : "#374151"} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderPriceSection = () => (
    <View style={styles.priceSection}>
      <View style={styles.priceRow}>
        <Text style={styles.currentPrice}>${stockData.currentPrice.toFixed(2)}</Text>
        <View style={styles.changeContainer}>
          <Ionicons 
            name={isPositive ? "trending-up" : "trending-down"} 
            size={16} 
            color={changeColor} 
          />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
      <Text style={styles.previousClose}>
        Previous Close: ${stockData.previousClose.toFixed(2)}
      </Text>
    </View>
  );

  const renderChartSection = () => (
    <View style={styles.chartSection}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Price Chart</Text>
        <View style={styles.timeframeContainer}>
          {timeframes.map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.timeframeButtonActive
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text style={[
                styles.timeframeText,
                selectedTimeframe === timeframe && styles.timeframeTextActive
              ]}>
                {timeframe}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Mock chart placeholder */}
      <View style={styles.chartPlaceholder}>
        <Ionicons name="analytics-outline" size={48} color="#6B7280" />
        <Text style={styles.chartPlaceholderText}>Chart Data</Text>
        <Text style={styles.chartPlaceholderSubtext}>
          Interactive price chart for {selectedTimeframe} timeframe
        </Text>
      </View>
    </View>
  );

  const renderKeyStats = () => (
    <View style={styles.keyStatsSection}>
      <Text style={styles.sectionTitle}>Key Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Open</Text>
          <Text style={styles.statValue}>${stockData.open.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>${stockData.high.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>${stockData.low.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Volume</Text>
          <Text style={styles.statValue}>{formatNumber(stockData.volume)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Market Cap</Text>
          <Text style={styles.statValue}>${formatNumber(stockData.marketCap)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>P/E Ratio</Text>
          <Text style={styles.statValue}>{stockData.peRatio}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Dividend Yield</Text>
          <Text style={styles.statValue}>{stockData.dividendYield}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sector</Text>
          <Text style={styles.statValue}>{stockData.sector}</Text>
        </View>
      </View>
    </View>
  );

  const renderCompanyInfo = () => (
    <View style={styles.companyInfoSection}>
      <Text style={styles.sectionTitle}>Company Information</Text>
      <Text style={styles.companyDescription}>{stockData.description}</Text>
      
      <View style={styles.companyDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Industry:</Text>
          <Text style={styles.detailValue}>{stockData.industry}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Employees:</Text>
          <Text style={styles.detailValue}>{formatNumber(stockData.employees)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Founded:</Text>
          <Text style={styles.detailValue}>{stockData.founded}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Headquarters:</Text>
          <Text style={styles.detailValue}>{stockData.headquarters}</Text>
        </View>
      </View>
    </View>
  );

  const renderTradingActions = () => (
    <View style={styles.tradingActionsContainer}>
      <TouchableOpacity style={styles.buyButton} onPress={handleBuyStock}>
        <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
        <Text style={styles.buyButtonText}>Buy {stockData.symbol}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.sellButton} onPress={handleSellStock}>
        <Ionicons name="remove-circle-outline" size={20} color="#FFFFFF" />
        <Text style={styles.sellButtonText}>Sell {stockData.symbol}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderPriceSection()}
        {renderChartSection()}
        {renderKeyStats()}
        {renderCompanyInfo()}
      </ScrollView>

      {renderTradingActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  stockName: {
    fontSize: 12,
    color: '#6B7280',
  },
  watchlistButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  previousClose: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timeframeContainer: {
    flexDirection: 'row',
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 4,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  timeframeButtonActive: {
    backgroundColor: '#2563EB',
  },
  timeframeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  keyStatsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  companyInfoSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  companyDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  companyDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  tradingActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  buyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sellButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sellButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default StockDetailScreen;
