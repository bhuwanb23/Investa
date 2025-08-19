import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stock } from '../hooks/useTradingData';

interface StockCardProps {
  stock: Stock;
  onPress: (stock: Stock) => void;
  onToggleFavorite: (symbol: string) => void;
  showChart?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  onPress,
  onToggleFavorite,
  showChart = true,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Simulate price update animation
    const pulseAnimation = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

    const interval = setInterval(() => {
      pulseAnimation.start();
    }, 5000);

    return () => clearInterval(interval);
  }, [pulseAnim]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(stock)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.headerRow}>
            <Text style={styles.symbol}>{stock.symbol}</Text>
            <View style={styles.exchangeBadge}>
              <Text style={styles.exchangeText}>{stock.exchange}</Text>
            </View>
          </View>
          
          <Text style={styles.companyName} numberOfLines={1}>
            {stock.name}
          </Text>
          
          <View style={styles.priceRow}>
            <Animated.Text 
              style={[
                styles.price,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              {stock.price}
            </Animated.Text>
            <Text
              style={[
                styles.change,
                { color: stock.isPositive ? '#10B981' : '#EF4444' }
              ]}
            >
              {stock.change}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {showChart && (
            <View style={styles.chartPlaceholder}>
              {/* Placeholder for chart - in real app, you'd use a chart library */}
              <View style={[
                styles.chartBar,
                { backgroundColor: stock.isPositive ? '#10B981' : '#EF4444' }
              ]} />
            </View>
          )}
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(stock.symbol)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={stock.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={stock.isFavorite ? '#EF4444' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  exchangeBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  exchangeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1E40AF',
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  chartPlaceholder: {
    width: 80,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartBar: {
    width: 60,
    height: 20,
    borderRadius: 2,
  },
  favoriteButton: {
    padding: 4,
  },
});

export default StockCard;
