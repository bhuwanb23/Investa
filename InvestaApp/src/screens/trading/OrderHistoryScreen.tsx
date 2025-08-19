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

const OrderHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Mock order history data
  const orderHistory = [
    {
      id: 1,
      stockSymbol: 'RELIANCE',
      stockName: 'Reliance Industries Ltd',
      orderType: 'BUY',
      quantity: 50,
      price: 2450.00,
      totalAmount: 122500,
      orderStatus: 'COMPLETED',
      orderDate: '2024-01-15',
      orderTime: '10:30 AM',
      currentPrice: 2847.50,
      unrealizedPnL: 19875,
      unrealizedPnLPercent: 16.22,
    },
    {
      id: 2,
      stockSymbol: 'TCS',
      stockName: 'Tata Consultancy Services',
      orderType: 'BUY',
      quantity: 30,
      price: 3800.00,
      totalAmount: 114000,
      orderStatus: 'COMPLETED',
      orderDate: '2024-01-14',
      orderTime: '02:15 PM',
      currentPrice: 3892.75,
      unrealizedPnL: 2782.5,
      unrealizedPnLPercent: 2.44,
    },
    {
      id: 3,
      stockSymbol: 'HDFC',
      stockName: 'HDFC Bank Ltd',
      orderType: 'BUY',
      quantity: 80,
      price: 1550.00,
      totalAmount: 124000,
      orderStatus: 'COMPLETED',
      orderDate: '2024-01-13',
      orderTime: '11:45 AM',
      currentPrice: 1647.30,
      unrealizedPnL: 7784,
      unrealizedPnLPercent: 6.28,
    },
    {
      id: 4,
      stockSymbol: 'INFY',
      stockName: 'Infosys Ltd',
      orderType: 'SELL',
      quantity: 25,
      price: 1500.00,
      totalAmount: 37500,
      orderStatus: 'COMPLETED',
      orderDate: '2024-01-12',
      orderTime: '03:20 PM',
      currentPrice: 1485.90,
      realizedPnL: 2500,
      realizedPnLPercent: 7.14,
    },
    {
      id: 5,
      stockSymbol: 'ICICIBANK',
      stockName: 'ICICI Bank Ltd',
      orderType: 'BUY',
      quantity: 120,
      price: 950.00,
      totalAmount: 114000,
      orderStatus: 'COMPLETED',
      orderDate: '2024-01-11',
      orderTime: '09:15 AM',
      currentPrice: 1092.45,
      unrealizedPnL: 17094,
      unrealizedPnLPercent: 15.0,
    },
    {
      id: 6,
      stockSymbol: 'HINDUNILVR',
      stockName: 'Hindustan Unilever Ltd',
      orderType: 'BUY',
      quantity: 40,
      price: 2500.00,
      totalAmount: 100000,
      orderStatus: 'PENDING',
      orderDate: '2024-01-10',
      orderTime: '01:30 PM',
      currentPrice: 2547.80,
      unrealizedPnL: 1912,
      unrealizedPnLPercent: 1.91,
    },
  ];

  const filters = ['All', 'Buy', 'Sell', 'Completed', 'Pending', 'Cancelled'];

  const filteredOrders = selectedFilter === 'All' 
    ? orderHistory 
    : orderHistory.filter(order => {
        if (selectedFilter === 'Buy') return order.orderType === 'BUY';
        if (selectedFilter === 'Sell') return order.orderType === 'SELL';
        if (selectedFilter === 'Completed') return order.orderStatus === 'COMPLETED';
        if (selectedFilter === 'Pending') return order.orderStatus === 'PENDING';
        if (selectedFilter === 'Cancelled') return order.orderStatus === 'CANCELLED';
        return true;
      });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '#10B981';
      case 'PENDING': return '#F59E0B';
      case 'CANCELLED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getOrderTypeColor = (type: string) => {
    return type === 'BUY' ? '#10B981' : '#EF4444';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Order History</Text>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
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
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOrderItem = (order: any) => {
    const isPositive = order.unrealizedPnL >= 0 || order.realizedPnL >= 0;
    const pnlColor = isPositive ? '#10B981' : '#EF4444';
    const pnlAmount = order.unrealizedPnL || order.realizedPnL || 0;
    const pnlPercent = order.unrealizedPnLPercent || order.realizedPnLPercent || 0;

    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => navigation.navigate('StockDetail', { 
          stockSymbol: order.stockSymbol, 
          stockName: order.stockName 
        })}
      >
        <View style={styles.orderHeader}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>{order.stockSymbol}</Text>
            <Text style={styles.stockName} numberOfLines={1}>{order.stockName}</Text>
          </View>
          <View style={styles.orderTypeContainer}>
            <View style={[
              styles.orderTypeBadge,
              { backgroundColor: getOrderTypeColor(order.orderType) + '20' }
            ]}>
              <Text style={[
                styles.orderTypeText,
                { color: getOrderTypeColor(order.orderType) }
              ]}>
                {order.orderType}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{order.quantity} shares</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>₹{order.price.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount:</Text>
            <Text style={styles.detailValue}>₹{order.totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Price:</Text>
            <Text style={styles.detailValue}>₹{order.currentPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.orderStatus) + '20' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(order.orderStatus) }
              ]}>
                {order.orderStatus}
              </Text>
            </View>
          </View>
          
          <View style={styles.pnlContainer}>
            <Text style={styles.pnlLabel}>
              {order.unrealizedPnL ? 'Unrealized' : 'Realized'} P&L
            </Text>
            <View style={styles.pnlValueRow}>
              <Ionicons 
                name={isPositive ? "trending-up" : "trending-down"} 
                size={14} 
                color={pnlColor} 
              />
              <Text style={[styles.pnlAmount, { color: pnlColor }]}>
                {isPositive ? '+' : ''}₹{pnlAmount.toLocaleString()}
              </Text>
            </View>
            <Text style={[styles.pnlPercent, { color: pnlColor }]}>
              {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.orderMeta}>
          <Text style={styles.orderDate}>{order.orderDate}</Text>
          <Text style={styles.orderTime}>{order.orderTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No Orders Found</Text>
      <Text style={styles.emptySubtitle}>
        You haven't placed any {selectedFilter.toLowerCase()} orders yet.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilterTabs()}
      
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => renderOrderItem(item)}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={renderEmptyState}
      />
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
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
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
  ordersList: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
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
  },
  orderTypeContainer: {
    alignItems: 'flex-end',
  },
  orderTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  statusContainer: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pnlContainer: {
    alignItems: 'flex-end',
  },
  pnlLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  pnlValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pnlAmount: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  pnlPercent: {
    fontSize: 10,
    fontWeight: '600',
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  orderDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  orderTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default OrderHistoryScreen;
