import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TradingButtonsProps {
  onBuy: () => void;
  onSell: () => void;
}

const TradingButtons: React.FC<TradingButtonsProps> = ({
  onBuy,
  onSell,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.sellButton]}
          onPress={onSell}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.buyButton]}
          onPress={onBuy}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32, // Extra padding for safe area
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  sellButton: {
    backgroundColor: '#DC2626',
  },
  buyButton: {
    backgroundColor: '#059669',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TradingButtons;
