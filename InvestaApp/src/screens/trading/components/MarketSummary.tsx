import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MARKET_INDICES } from '../constants/tradingConstants';

interface MarketSummaryProps {
  selectedIndex?: string;
  onIndexPress?: (index: string) => void;
}

const MarketSummary: React.FC<MarketSummaryProps> = ({
  selectedIndex = 'NIFTY 50',
  onIndexPress,
}) => {
  const selectedIndexData = MARKET_INDICES.find(index => index.name === selectedIndex);

  return (
    <View style={styles.container}>
      <View style={styles.mainIndex}>
        <View style={styles.indexInfo}>
          <Text style={styles.indexName}>{selectedIndexData?.name}</Text>
          <Text style={styles.indexValue}>{selectedIndexData?.value}</Text>
          <Text
            style={[
              styles.indexChange,
              { color: selectedIndexData?.isPositive ? '#10B981' : '#EF4444' }
            ]}
          >
            {selectedIndexData?.change} ({selectedIndexData?.changePercent})
          </Text>
        </View>
        <View style={styles.chartPlaceholder}>
          {/* Placeholder for chart */}
          <Ionicons name="trending-up" size={24} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.otherIndices}>
        {MARKET_INDICES.filter(index => index.name !== selectedIndex).map((index) => (
          <TouchableOpacity
            key={index.name}
            style={styles.indexCard}
            onPress={() => onIndexPress?.(index.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.otherIndexName}>{index.name}</Text>
            <Text style={styles.otherIndexValue}>{index.value}</Text>
            <Text
              style={[
                styles.otherIndexChange,
                { color: index.isPositive ? '#10B981' : '#EF4444' }
              ]}
            >
              {index.changePercent}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  mainIndex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  indexInfo: {
    flex: 1,
  },
  indexName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  indexValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  indexChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartPlaceholder: {
    width: 64,
    height: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherIndices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indexCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  otherIndexName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  otherIndexValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  otherIndexChange: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MarketSummary;
