import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChartSectionProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  selectedTimeframe,
  onTimeframeChange,
}) => {
  const timeframes = ['1D', '1W', '1M', '1Y'];

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
        {/* Placeholder for chart - in real app, you'd use a chart library */}
        <View style={styles.chartPlaceholder}>
          <Ionicons name="trending-up" size={48} color="#10B981" />
          <Text style={styles.chartPlaceholderText}>Chart Placeholder</Text>
          <Text style={styles.chartPlaceholderSubtext}>
            {selectedTimeframe} timeframe selected
          </Text>
        </View>
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
  chartContainer: {
    height: 250,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chartPlaceholder: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 4,
  },
});

export default ChartSection;
