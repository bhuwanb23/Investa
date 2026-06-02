import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../../../components/EmptyState';

const { width } = Dimensions.get('window');

interface ChartSectionProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  priceHistory?: any[];
}

const ChartSection: React.FC<ChartSectionProps> = ({
  selectedTimeframe,
  onTimeframeChange,
  priceHistory = [],
}) => {
  const timeframes = ['1D', '1W', '1M', '1Y'];

  // Map backend priceHistory to candlestick data points
  const candlestickData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];
    return priceHistory.map((item: any, i: number) => {
      const open = Number(item.open_price ?? item.price ?? 0);
      const close = Number(item.close_price ?? item.price ?? 0);
      const high = Number(item.high_price ?? Math.max(open, close));
      const low = Number(item.low_price ?? Math.min(open, close));
      return {
        open,
        high,
        low,
        close,
        volume: Number(item.volume ?? 0),
        date: item.date ? new Date(item.date) : new Date(),
        isGreen: close >= open,
        index: i,
      };
    }).filter((c: any) => c.open > 0 || c.close > 0);
  }, [priceHistory]);

  // Compute Y-axis range from real data
  const yAxis = useMemo(() => {
    if (candlestickData.length === 0) return { min: 0, max: 0, step: 0 };
    const lows = candlestickData.map((c: any) => c.low);
    const highs = candlestickData.map((c: any) => c.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const range = max - min;
    const step = range / 5; // 5 grid lines
    return { min, max, step };
  }, [candlestickData]);

  const currentCandle = candlestickData[candlestickData.length - 1];
  const firstCandle = candlestickData[0];
  const totalChange = currentCandle && firstCandle
    ? (currentCandle.close - firstCandle.open).toFixed(2)
    : '0.00';
  const totalChangePct = currentCandle && firstCandle && firstCandle.open > 0
    ? (((currentCandle.close - firstCandle.open) / firstCandle.open) * 100).toFixed(2)
    : '0.00';

  const renderCandlestick = (candle: any, index: number) => {
    const isGreen = candle.isGreen;
    const bodyHeight = Math.max(Math.abs(candle.close - candle.open) * 1.5, 2);
    const bodyTop = Math.min(candle.open, candle.close);
    const wickTop = candle.high;
    const wickBottom = candle.low;

    const candleWidth = Math.max((width - 80) / Math.max(candlestickData.length, 1), 6);
    const xPosition = index * candleWidth;
    const yRange = yAxis.max - yAxis.min || 1;

    return (
      <View key={index} style={[styles.candlestickContainer, { left: xPosition, width: candleWidth - 2 }]}>
        {/* Wick */}
        <View style={[
          styles.candlestickWick,
          {
            height: ((wickTop - wickBottom) / yRange) * 240,
            backgroundColor: isGreen ? '#10B981' : '#EF4444',
            top: ((yAxis.max - wickTop) / yRange) * 240,
          }
        ]} />

        {/* Body */}
        <View style={[
          styles.candlestickBody,
          {
            height: Math.max(bodyHeight, 2),
            backgroundColor: isGreen ? '#10B981' : '#EF4444',
            top: ((yAxis.max - bodyTop) / yRange) * 240,
          }
        ]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeframeButtons}>
          {timeframes.map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.activeTimeframeButton
              ]}
              onPress={() => onTimeframeChange(timeframe)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe && styles.activeTimeframeText
                ]}
              >
                {timeframe}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        {candlestickData.length === 0 ? (
          <EmptyState
            icon="bar-chart-outline"
            title="No price history available"
            subtitle="Price history will appear once trading data is available for this stock."
          />
        ) : (
          <>
            <View style={styles.chartInfo}>
              <View style={styles.chartStats}>
                <Text style={styles.chartStatLabel}>Current</Text>
                <Text style={styles.chartStatValue}>
                  ₹{currentCandle?.close.toFixed(2) ?? '0.00'}
                </Text>
              </View>
              <View style={styles.chartStats}>
                <Text style={styles.chartStatLabel}>Change</Text>
                <Text style={[
                  styles.chartStatValue,
                  {
                    color: currentCandle && currentCandle.close >= firstCandle.open
                      ? '#10B981'
                      : '#EF4444'
                  }
                ]}>
                  {currentCandle && currentCandle.close >= firstCandle.open ? '+' : ''}
                  {totalChange} ({totalChangePct}%)
                </Text>
              </View>
              <View style={styles.chartStats}>
                <Text style={styles.chartStatLabel}>Points</Text>
                <Text style={styles.chartStatValue}>{candlestickData.length}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.chartScrollContainer,
                { width: Math.max(width - 32, candlestickData.length * 14) }
              ]}
            >
              <View style={styles.chartArea}>
                <View style={styles.chartBackground} />

                {/* Grid Lines */}
                <View style={styles.chartGrid}>
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <View key={line} style={[styles.gridLine, { top: `${line * 20}%` }]} />
                  ))}
                </View>

                {/* Y-axis labels */}
                <View style={styles.priceScale}>
                  {[0, 1, 2, 3, 4, 5].map((scale) => {
                    const value = yAxis.max - (yAxis.step * scale);
                    return (
                      <Text key={scale} style={[styles.priceLabel, { top: `${scale * 20}%` }]}>
                        ₹{value.toFixed(0)}
                      </Text>
                    );
                  })}
                </View>

                {/* Candlesticks */}
                <View style={styles.candlesticksContainer}>
                  {candlestickData.map((candle: any, index: number) => renderCandlestick(candle, index))}
                </View>
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  timeframeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeTimeframeButton: {
    backgroundColor: '#3B82F6',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTimeframeText: {
    color: '#FFFFFF',
  },
  chartContainer: {
    minHeight: 320,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chartScrollContainer: {
    height: 280,
  },
  chartArea: {
    height: 280,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    position: 'relative',
    overflow: 'hidden',
    minWidth: width - 32,
  },
  chartBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1F2937',
  },
  chartGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  gridLine: {
    position: 'absolute',
    left: 50,
    right: 0,
    height: 1,
    backgroundColor: '#374151',
  },
  priceScale: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    width: 44,
    zIndex: 2,
  },
  priceLabel: {
    position: 'absolute',
    fontSize: 9,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  candlesticksContainer: {
    position: 'absolute',
    top: 8,
    left: 50,
    right: 8,
    bottom: 8,
    zIndex: 3,
  },
  candlestickContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  candlestickWick: {
    position: 'absolute',
    width: 1,
    backgroundColor: '#10B981',
  },
  candlestickBody: {
    position: 'absolute',
    width: '80%',
    borderRadius: 1,
  },
  chartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  chartStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartStatLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chartStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F9FAFB',
  },
});

export default ChartSection;
