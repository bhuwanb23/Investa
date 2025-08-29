import React, { useEffect, useState } from 'react';
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
import { fetchOrderHistory } from './utils/tradingApi';
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
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchOrderHistory();
        if (!mounted) return;
        console.log('OrderHistory: Received orders data:', data);
        setOrders(data);
      } catch (error) {
        console.error('OrderHistory: Error fetching orders:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getFilteredOrders = () => {
    let filtered = orders;
    
    switch (selectedFilter) {
      case 'Buy':
        filtered = filtered.filter(order => (order.side || order.type) === 'BUY');
        break;
      case 'Sell':
        filtered = filtered.filter(order => (order.side || order.type) === 'SELL');
        break;
      case 'This Week':
        // Filter for orders from this week (mock implementation)
        filtered = filtered.filter(order => Number(order.id) % 3 === 0); // Mock filter
        break;
      case 'This Month':
        // Filter for orders from this month (mock implementation)
        filtered = filtered.filter(order => Number(order.id) % 2 === 0); // Mock filter
        break;
      default:
        // 'All' - no filtering
        break;
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const renderHeader = () => (
    <View style={styles.header}>
      <MainHeader title="Order History" iconName="time" showBackButton onBackPress={handleBack} />
    </View>
  );

  const renderSummarySection = () => {
    // Calculate real statistics from orders
    const totalOrders = orders.length;
    const buyOrders = orders.filter(order => (order.side || order.type) === 'BUY').length;
    const sellOrders = orders.filter(order => (order.side || order.type) === 'SELL').length;
    
    // Calculate total value of orders
    const totalValue = orders.reduce((sum, order) => {
      const orderValue = (order.price || 0) * (order.quantity || 0);
      return sum + orderValue;
    }, 0);
    
    // Calculate completion rate based on order status
    const completedOrders = orders.filter(order => 
      order.status === 'FILLED' || order.status === 'COMPLETED'
    ).length;
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
    
    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? Math.round(totalValue / totalOrders) : 0;
    
    return (
      <View style={styles.summarySection}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalOrders}</Text>
            <Text style={styles.summaryLabel}>Total Orders</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValueSuccess}>{completionRate}%</Text>
            <Text style={styles.summaryLabel}>Completion Rate</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValueSuccess}>₹{avgOrderValue.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Avg Order Value</Text>
          </View>
        </View>
      </View>
    );
  };

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
    // Map backend data structure to UI format
    const symbol = trade?.stock_detail?.symbol || trade?.stock?.symbol || '-';
    const name = trade?.stock_detail?.name || trade?.stock?.name || symbol;
    const type = trade?.side || trade?.type || 'BUY';
    const status = trade?.status || 'PENDING';
    const qty = trade?.quantity ?? 0;
    const price = trade?.price != null ? `₹${trade.price}` : '—';
    const total = trade?.total_amount != null ? `₹${trade.total_amount}` : `₹${(trade.price * trade.quantity).toFixed(2)}`;
    
    const mapped = {
      id: String(trade.id ?? Math.random()),
      symbol,
      name,
      type,
      status,
      quantity: qty,
      total,
      price,
      isPositive: type === 'SELL',
    };
    
    const isExpanded = expandedItems.has(mapped.id);
    const isPositive = mapped.isPositive;

    return (
      <View key={mapped.id} style={styles.tradeItem}>
        <TouchableOpacity
          style={styles.tradeHeader}
          onPress={() => toggleItemExpansion(mapped.id)}
        >
          <View style={styles.tradeLeft}>
            <View style={[
              styles.stockBadge,
              { backgroundColor: mapped.type === 'BUY' ? '#DBEAFE' : '#FEE2E2' }
            ]}>
              <Ionicons 
                name="business" 
                size={20} 
                color={mapped.type === 'BUY' ? '#2563EB' : '#DC2626'} 
              />
            </View>
            <View style={styles.tradeInfo}>
              <View style={styles.stockHeader}>
                <Text style={styles.stockSymbol}>{mapped.symbol}</Text>
                <Text style={styles.stockName} numberOfLines={1} ellipsizeMode="tail">
                  {mapped.name}
                </Text>
              </View>
              <Text style={styles.tradeTime}>Today, 2:45 PM</Text>
            </View>
          </View>
          <View style={styles.tradeRight}>
            <View style={styles.tradeStatus}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: mapped.status === 'FILLED' || mapped.status === 'COMPLETED' ? '#10B981' : '#F59E0B' }
              ]}>
                <Text style={styles.statusText}>{mapped.type}</Text>
              </View>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#9CA3AF" 
              />
            </View>
            <Text style={styles.tradePrice} numberOfLines={1} ellipsizeMode="tail">
              {mapped.price}
            </Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.tradeDetails}>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quantity:</Text>
                <Text style={styles.detailValue}>{mapped.quantity} shares</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.detailValue}>{mapped.total}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[
                  styles.detailValue,
                  { color: mapped.status === 'FILLED' || mapped.status === 'COMPLETED' ? '#10B981' : '#DC2626' }
                ]}>
                  {mapped.status}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Order ID:</Text>
                <Text style={styles.detailValue}>#{mapped.id}</Text>
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
      {filteredOrders.map(renderTradeItem)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSummarySection()}
      {renderFilterSection()}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ padding: 16 }}><Text>Loading…</Text></View>
        ) : (
          renderTradesList()
        )}
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
    backgroundColor: '#FFFFFF',
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
    minHeight: 80,
  },
  tradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
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
    flexShrink: 0,
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stockSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flexShrink: 1,
    flex: 1,
  },
  tradeInfo: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  tradeTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  tradeRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
    minWidth: 80,
  },
  tradeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
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
    textAlign: 'right',
    flexShrink: 1,
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
