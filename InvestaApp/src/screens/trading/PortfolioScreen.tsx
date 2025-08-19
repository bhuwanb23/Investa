import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// Define navigation types
type RootStackParamList = {
  StockDetail: { stockSymbol: string; stockName: string };
  Home: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const PortfolioScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  // Mock portfolio data
  const portfolioData = {
    totalValue: 125000,
    totalInvested: 100000,
    totalPnL: 25000,
    totalPnLPercent: 25.0,
    cashBalance: 15000,
    totalStocks: 8,
  };

  const holdings = [
    {
      id: 1,
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      quantity: 50,
      avgPrice: 2450.00,
      currentPrice: 2847.50,
      marketValue: 142375,
      investedAmount: 122500,
      unrealizedPnL: 19875,
      unrealizedPnLPercent: 16.22,
      sector: 'Oil & Gas',
      weight: 11.4,
    },
    {
      id: 2,
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      quantity: 30,
      avgPrice: 3800.00,
      currentPrice: 3892.75,
      marketValue: 116782.5,
      investedAmount: 114000,
      unrealizedPnL: 2782.5,
      unrealizedPnLPercent: 2.44,
      sector: 'IT',
      weight: 9.3,
    },
    {
      id: 3,
      symbol: 'HDFC',
      name: 'HDFC Bank Ltd',
      quantity: 80,
      avgPrice: 1550.00,
      currentPrice: 1647.30,
      marketValue: 131784,
      investedAmount: 124000,
      unrealizedPnL: 7784,
      unrealizedPnLPercent: 6.28,
      sector: 'Banking',
      weight: 10.5,
    },
    {
      id: 4,
      symbol: 'INFY',
      name: 'Infosys Ltd',
      quantity: 100,
      avgPrice: 1400.00,
      currentPrice: 1485.90,
      marketValue: 148590,
      investedAmount: 140000,
      unrealizedPnL: 8590,
      unrealizedPnLPercent: 6.14,
      sector: 'IT',
      weight: 11.9,
    },
    {
      id: 5,
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Ltd',
      quantity: 120,
      avgPrice: 950.00,
      currentPrice: 1092.45,
      marketValue: 131094,
      investedAmount: 114000,
      unrealizedPnL: 17094,
      unrealizedPnLPercent: 15.0,
      sector: 'Banking',
      weight: 10.5,
    },
  ];

  const sectorAllocation = [
    { sector: 'IT', weight: 21.2, color: '#3B82F6' },
    { sector: 'Banking', weight: 21.0, color: '#10B981' },
    { sector: 'Oil & Gas', weight: 11.4, color: '#F59E0B' },
    { sector: 'FMCG', weight: 8.5, color: '#8B5CF6' },
    { sector: 'Others', weight: 37.9, color: '#6B7280' },
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  const isPositive = portfolioData.totalPnL >= 0;
  const pnlColor = isPositive ? '#10B981' : '#EF4444';

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Portfolio</Text>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );

  const renderPortfolioSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Portfolio Value</Text>
        <Text style={styles.summaryValue}>₹{portfolioData.totalValue.toLocaleString()}</Text>
      </View>
      
      <View style={styles.pnlContainer}>
        <View style={styles.pnlRow}>
          <Text style={styles.pnlLabel}>Total P&L</Text>
          <View style={styles.pnlValueContainer}>
            <Ionicons 
              name={isPositive ? "trending-up" : "trending-down"} 
              size={16} 
              color={pnlColor} 
            />
            <Text style={[styles.pnlValue, { color: pnlColor }]}>
              {isPositive ? '+' : ''}₹{portfolioData.totalPnL.toLocaleString()}
            </Text>
          </View>
        </View>
        <Text style={[styles.pnlPercent, { color: pnlColor }]}>
          {isPositive ? '+' : ''}{portfolioData.totalPnLPercent.toFixed(2)}%
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{portfolioData.totalInvested.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Invested</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{portfolioData.cashBalance.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Cash</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{portfolioData.totalStocks}</Text>
          <Text style={styles.statLabel}>Stocks</Text>
        </View>
      </View>
    </View>
  );

  const renderTimeframeSelector = () => (
    <View style={styles.timeframeContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeframeContent}
      >
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
      </ScrollView>
    </View>
  );

  const renderSectorAllocation = () => (
    <View style={styles.sectorContainer}>
      <Text style={styles.sectionTitle}>Sector Allocation</Text>
      <View style={styles.sectorChart}>
        <View style={styles.pieChart}>
          <Ionicons name="pie-chart-outline" size={48} color="#6B7280" />
          <Text style={styles.pieChartText}>Chart</Text>
        </View>
        <View style={styles.sectorList}>
          {sectorAllocation.map((sector) => (
            <View key={sector.sector} style={styles.sectorItem}>
              <View style={[styles.sectorColor, { backgroundColor: sector.color }]} />
              <Text style={styles.sectorName}>{sector.sector}</Text>
              <Text style={styles.sectorWeight}>{sector.weight}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderHoldingItem = (holding: any) => {
    const isPositive = holding.unrealizedPnL >= 0;
    const pnlColor = isPositive ? '#10B981' : '#EF4444';

    return (
      <TouchableOpacity
        style={styles.holdingItem}
        onPress={() => navigation.navigate('StockDetail', { 
          stockSymbol: holding.symbol, 
          stockName: holding.name 
        })}
      >
        <View style={styles.holdingHeader}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>{holding.symbol}</Text>
            <Text style={styles.stockName} numberOfLines={1}>{holding.name}</Text>
            <Text style={styles.stockSector}>{holding.sector}</Text>
          </View>
          <View style={styles.stockPrice}>
            <Text style={styles.currentPrice}>₹{holding.currentPrice.toFixed(2)}</Text>
            <Text style={styles.quantity}>{holding.quantity} shares</Text>
          </View>
        </View>

        <View style={styles.holdingDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Market Value:</Text>
            <Text style={styles.detailValue}>₹{holding.marketValue.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Avg Price:</Text>
            <Text style={styles.detailValue}>₹{holding.avgPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight:</Text>
            <Text style={styles.detailValue}>{holding.weight}%</Text>
          </View>
        </View>

        <View style={styles.pnlSection}>
          <View style={styles.pnlInfo}>
            <Text style={styles.pnlLabel}>Unrealized P&L</Text>
            <View style={styles.pnlValueRow}>
              <Ionicons 
                name={isPositive ? "trending-up" : "trending-down"} 
                size={14} 
                color={pnlColor} 
              />
              <Text style={[styles.pnlAmount, { color: pnlColor }]}>
                {isPositive ? '+' : ''}₹{holding.unrealizedPnL.toLocaleString()}
              </Text>
            </View>
          </View>
          <Text style={[styles.pnlPercent, { color: pnlColor }]}>
            {isPositive ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderPortfolioSummary()}
        {renderTimeframeSelector()}
        {renderSectorAllocation()}
        
        <View style={styles.holdingsSection}>
          <Text style={styles.sectionTitle}>Holdings ({holdings.length})</Text>
          {holdings.map(renderHoldingItem)}
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  summaryHeader: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  pnlContainer: {
    marginBottom: 20,
  },
  pnlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pnlLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  pnlValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pnlValue: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  pnlPercent: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeframeContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginBottom: 8,
  },
  timeframeContent: {
    paddingHorizontal: 16,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  timeframeButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeframeTextActive: {
    color: '#2563EB',
  },
  sectorContainer: {
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
  sectorChart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  pieChartText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectorList: {
    flex: 1,
  },
  sectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectorColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sectorName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  sectorWeight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  holdingsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  holdingItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stockInfo: {
    flex: 1,
    marginRight: 16,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  stockSector: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stockPrice: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  holdingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  pnlSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pnlInfo: {
    flex: 1,
  },
  pnlLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  pnlValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pnlAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  pnlPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PortfolioScreen;
