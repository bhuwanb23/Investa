import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface OrderTypeToggleProps {
  isBuyMode: boolean;
  onToggle: (isBuy: boolean) => void;
}

const OrderTypeToggle: React.FC<OrderTypeToggleProps> = ({
  isBuyMode,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isBuyMode && styles.buyButton,
            !isBuyMode && styles.inactiveButton,
          ]}
          onPress={() => onToggle(true)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              isBuyMode && styles.buyText,
              !isBuyMode && styles.inactiveText,
            ]}
          >
            Buy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !isBuyMode && styles.sellButton,
            isBuyMode && styles.inactiveButton,
          ]}
          onPress={() => onToggle(false)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              !isBuyMode && styles.sellText,
              isBuyMode && styles.inactiveText,
            ]}
          >
            Sell
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  buyButton: {
    backgroundColor: '#10B981',
  },
  sellButton: {
    backgroundColor: '#EF4444',
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buyText: {
    color: '#FFFFFF',
  },
  sellText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#6B7280',
  },
});

export default OrderTypeToggle;
