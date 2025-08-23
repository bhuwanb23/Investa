import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ChartSectionProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  filterOptions?: string[];
}

const ChartSection: React.FC<ChartSectionProps> = ({
  selectedTimeframe,
  onTimeframeChange,
  selectedFilter = 'All',
  onFilterChange,
  filterOptions = ['All', 'Bullish', 'Bearish', 'Volatile', 'This Week', 'This Month', 'This Year'],
}) => {
  const timeframes = ['1D', '1W', '1M', '1Y'];
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate mock candlestick data based on timeframe and filter
  const generateCandlestickData = () => {
    const data = [];
    let basePoints = selectedTimeframe === '1D' ? 24 : 
                     selectedTimeframe === '1W' ? 7 : 
                     selectedTimeframe === '1M' ? 30 : 12;
    
    // Adjust data points based on filter
    if (selectedFilter === 'This Week') {
      basePoints = 7;
    } else if (selectedFilter === 'This Month') {
      basePoints = 30;
    } else if (selectedFilter === 'This Year') {
      basePoints = 365;
    }
    
    // Apply zoom level to show more/less data
    const actualPoints = Math.floor(basePoints * zoomLevel);
    
    let basePrice = 2456.80;
    let trend = 0; // For creating trends based on filter
    
    // Set trend based on filter
    if (selectedFilter === 'Bullish') {
      trend = 1;
    } else if (selectedFilter === 'Bearish') {
      trend = -1;
    } else if (selectedFilter === 'Volatile') {
      trend = 0.5;
    }
    
    for (let i = 0; i < actualPoints; i++) {
      const variation = (Math.random() - 0.5) * 50;
      const trendInfluence = trend * (i / actualPoints) * 100; // Gradual trend influence
      const open = basePrice;
      const close = basePrice + variation + trendInfluence;
      const high = Math.max(open, close) + Math.random() * 20;
      const low = Math.min(open, close) - Math.random() * 20;
      const volume = Math.random() * 1000000;
      
      data.push({
        open,
        high,
        low,
        close,
        volume,
        timestamp: i,
        isGreen: close >= open,
        date: new Date(Date.now() - (actualPoints - i) * 24 * 60 * 60 * 1000), // Backward date calculation
      });
      
      basePrice = close;
    }
    return data;
  };

  const candlestickData = generateCandlestickData();

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel * 1.5, 5);
    setZoomLevel(newZoom);
    setIsZoomed(newZoom > 1);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel / 1.5, 0.5);
    setZoomLevel(newZoom);
    setIsZoomed(newZoom > 1);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset(0);
    setIsZoomed(false);
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const renderCandlestick = (candle: any, index: number) => {
    const isGreen = candle.isGreen;
    const bodyHeight = Math.abs(candle.close - candle.open) * 2;
    const bodyTop = Math.min(candle.open, candle.close);
    const wickTop = candle.high;
    const wickBottom = candle.low;
    
    const candleWidth = Math.max((width - 120) / candlestickData.length, 8);
    const xPosition = 60 + (index * candleWidth) + panOffset;
    
    return (
      <View key={index} style={[styles.candlestickContainer, { left: xPosition, width: candleWidth - 2 }]}>
        {/* Wick */}
        <View style={[
          styles.candlestickWick,
          {
            height: (wickTop - wickBottom) * 2,
            backgroundColor: isGreen ? '#10B981' : '#EF4444',
            top: (wickBottom - Math.min(...candlestickData.map(c => c.low))) * 2,
          }
        ]} />
        
        {/* Body */}
        <View style={[
          styles.candlestickBody,
          {
            height: Math.max(bodyHeight, 2),
            backgroundColor: isGreen ? '#10B981' : '#EF4444',
            top: (bodyTop - Math.min(...candlestickData.map(c => c.low))) * 2,
          }
        ]} />
        
        {/* Date label for zoomed view */}
        {isZoomed && index % Math.max(1, Math.floor(candlestickData.length / 10)) === 0 && (
          <Text style={styles.dateLabel}>
            {candle.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        )}
      </View>
    );
  };

  const getFilterDescription = () => {
    switch (selectedFilter) {
      case 'Bullish':
        return '📈 Bullish Trend';
      case 'Bearish':
        return '📉 Bearish Trend';
      case 'Volatile':
        return '📊 High Volatility';
      case 'This Week':
        return '📅 This Week';
      case 'This Month':
        return '📅 This Month';
      case 'This Year':
        return '📅 This Year';
      default:
        return '📊 All Data';
    }
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
        
        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Ionicons name="remove" size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Ionicons name="add" size={16} color="#6B7280" />
          </TouchableOpacity>
          {isZoomed && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filter Controls */}
      <View style={styles.filterControls}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => onFilterChange?.(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.activeFilterButtonText
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.chartContainer}>
        {/* Filter Description */}
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>{getFilterDescription()}</Text>
          <Text style={styles.dataPointsText}>{candlestickData.length} data points</Text>
        </View>
        
        {/* Candlestick Chart */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.chartScrollContainer,
            { width: Math.max(width - 32, candlestickData.length * 20) }
          ]}
          scrollEnabled={isZoomed}
        >
          <View style={styles.chartArea}>
            {/* Dark Background */}
            <View style={styles.chartBackground} />
            
            {/* Grid Lines */}
            <View style={styles.chartGrid}>
              {[0, 1, 2, 3, 4, 5].map((line) => (
                <View key={line} style={[styles.gridLine, { top: `${line * 20}%` }]} />
              ))}
            </View>
            
            {/* Price Scale */}
            <View style={styles.priceScale}>
              {[0, 1, 2, 3, 4, 5].map((scale) => (
                <Text key={scale} style={[styles.priceLabel, { top: `${scale * 20}%` }]}>
                  ₹{(2500 - scale * 40).toFixed(0)}
                </Text>
              ))}
            </View>
            
            {/* Candlesticks */}
            <View style={styles.candlesticksContainer}>
              {candlestickData.map((candle, index) => renderCandlestick(candle, index))}
            </View>
            
            {/* Chart Info Overlay */}
            <View style={styles.chartInfo}>
              <View style={styles.chartStats}>
                <Text style={styles.chartStatLabel}>Current</Text>
                <Text style={styles.chartStatValue}>
                  ₹{candlestickData[candlestickData.length - 1]?.close.toFixed(2)}
                </Text>
              </View>
              <View style={styles.chartStats}>
                <Text style={styles.chartStatLabel}>Change</Text>
                <Text style={[
                  styles.chartStatValue,
                  { 
                    color: candlestickData[candlestickData.length - 1]?.isGreen ? '#10B981' : '#EF4444' 
                  }
                ]}>
                  {candlestickData[candlestickData.length - 1]?.isGreen ? '+' : ''}
                  {(candlestickData[candlestickData.length - 1]?.close - candlestickData[0]?.open).toFixed(2)}
                </Text>
              </View>
              {isZoomed && (
                <View style={styles.chartStats}>
                  <Text style={styles.chartStatLabel}>Zoom</Text>
                  <Text style={styles.chartStatValue}>{zoomLevel.toFixed(1)}x</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
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
    gap: 16,
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
  zoomControls: {
    flexDirection: 'row',
    gap: 8,
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterControls: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterScrollContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  chartContainer: {
    height: 400,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  dataPointsText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chartScrollContainer: {
    height: 350,
  },
  chartArea: {
    flex: 1,
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
    left: 8,
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 2,
  },
  priceLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  candlesticksContainer: {
    position: 'absolute',
    top: 20,
    left: 50,
    right: 20,
    bottom: 40,
    zIndex: 3,
  },
  candlestickContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
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
  dateLabel: {
    position: 'absolute',
    top: '100%',
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 4,
  },
  chartInfo: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 8,
    padding: 12,
    zIndex: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chartStatLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginRight: 8,
  },
  chartStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F9FAFB',
  },
});

export default ChartSection;
