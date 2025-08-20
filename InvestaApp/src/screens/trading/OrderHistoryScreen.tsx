import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ORDER_HISTORY } from './constants/tradingConstants';
import MainHeader from '../../components/MainHeader';

// Define navigation types
type RootStackParamList = {
  StockDetail: { stockSymbol: string; stockName: string };
  Home: undefined;
  Trading: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const OrderHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filters = ['All', 'Buy', 'Sell', 'This Week', 'This Month'];

  const handleBack = () => {
    navigation.navigate('Trading');
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <MainHeader title="Order History" iconName="time" showBackButton onBackPress={handleBack} />
    </View>
  );

  const renderSummarySection = () => (
    <View style={styles.summarySection}>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>142</Text>
          <Text style={styles.summaryLabel}>Total Trades</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValueSuccess}>68%</Text>
          <Text style={styles.summaryLabel}>Win Rate</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValueSuccess}>+₹2,840</Text>
          <Text style={styles.summaryLabel}>Net P&L</Text>
        </View>
      </View>
    </View>
  );

  const renderFilterSection = () => (
    <View style={styles.filterSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTradeItem = (trade: any) => {
    const isExpanded = expandedItems.has(trade.id);
    const isPositive = trade.isPositive;

    return (
      <View key={trade.id} style={styles.tradeItem}>
        <TouchableOpacity
          style={styles.tradeHeader}
          onPress={() => toggleItemExpansion(trade.id)}
        >
          <View style={styles.tradeLeft}>
            <View style={[
              styles.stockBadge,
              { backgroundColor: trade.type === 'BUY' ? '#DBEAFE' : '#FEE2E2' }
            ]}>
              <Text style={[
                styles.stockSymbol,
                { color: trade.type === 'BUY' ? '#2563EB' : '#DC2626' }
              ]}>
                {trade.symbol}
              </Text>
            </View>
            <View style={styles.tradeInfo}>
              <Text style={styles.stockName}>{trade.name}</Text>
              <Text style={styles.tradeTime}>Today, 2:45 PM</Text>
            </View>
          </View>
          <View style={styles.tradeRight}>
            <View style={styles.tradeStatus}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: trade.status === 'COMPLETED' ? '#10B981' : '#F59E0B' }
              ]}>
                <Text style={styles.statusText}>{trade.type}</Text>
              </View>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#9CA3AF" 
              />
            </View>
            <Text style={styles.tradePrice}>{trade.price}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.tradeDetails}>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quantity:</Text>
                <Text style={styles.detailValue}>{trade.quantity} shares</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.detailValue}>{trade.total}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[
                  styles.detailValue,
                  { color: trade.status === 'COMPLETED' ? '#10B981' : '#F59E0B' }
                ]}>
                  {trade.status}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Order ID:</Text>
                <Text style={styles.detailValue}>#{trade.id}</Text>
              </View>
              {trade.profit && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>P&L:</Text>
                  <Text style={[
                    styles.detailValue,
                    { color: isPositive ? '#10B981' : '#DC2626' }
                  ]}>
                    {trade.profit}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderTradesList = () => (
    <View style={styles.tradesList}>
      {ORDER_HISTORY.map(renderTradeItem)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSummarySection()}
      {renderFilterSection()}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {renderTradesList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerFilterButton: {
    padding: 8,
    marginRight: -8,
  },
  summarySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summaryValueSuccess: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#2563EB',
  },
  content: {
    flex: 1,
  },
  tradesList: {
    paddingBottom: 20,
  },
  tradeItem: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stockBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  stockSymbol: {
    fontSize: 14,
    fontWeight: '600',
  },
  tradeInfo: {
    gap: 4,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  tradeTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  tradePrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  tradeDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
});

export default OrderHistoryScreen;
