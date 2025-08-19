import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../hooks/useTradingData';

interface StockDetailHeaderProps {
  stock: Stock;
  onBack: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
  isBookmarked: boolean;
}

const StockDetailHeader: React.FC<StockDetailHeaderProps> = ({
  stock,
  onBack,
  onToggleBookmark,
  onShare,
  isBookmarked,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onToggleBookmark}>
            <Ionicons 
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
              size={24} 
              color="#6B7280" 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Ionicons name="share-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stockInfo}>
        <View style={styles.stockHeader}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <View style={styles.exchangeBadge}>
            <Text style={styles.exchangeText}>{stock.exchange}</Text>
          </View>
        </View>
        
        <Text style={styles.companyName}>{stock.name}</Text>

        <View style={styles.priceSection}>
          <Text style={styles.price}>{stock.price}</Text>
          <View style={styles.changeRow}>
            <Text
              style={[
                styles.change,
                { color: stock.isPositive ? '#10B981' : '#EF4444' }
              ]}
            >
              {stock.changeValue}
            </Text>
            <Text
              style={[
                styles.changePercent,
                { color: stock.isPositive ? '#10B981' : '#EF4444' }
              ]}
            >
              {stock.change}
            </Text>
            <Text style={styles.todayLabel}>Today</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Volume</Text>
            <Text style={styles.statValue}>{stock.volume}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Market Cap</Text>
            <Text style={styles.statValue}>{stock.marketCap}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>P/E Ratio</Text>
            <Text style={styles.statValue}>28.42</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  stockInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  exchangeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  exchangeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  priceSection: {
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  changePercent: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
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
});

export default StockDetailHeader;
