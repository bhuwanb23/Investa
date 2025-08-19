import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface OrderFormProps {
  orderType: 'MARKET' | 'LIMIT';
  quantity: string;
  price: string;
  onOrderTypeChange: (type: 'MARKET' | 'LIMIT') => void;
  onQuantityChange: (quantity: string) => void;
  onPriceChange: (price: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  orderType,
  quantity,
  price,
  onOrderTypeChange,
  onQuantityChange,
  onPriceChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Order Type Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Order Type</Text>
        <View style={styles.orderTypeContainer}>
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              orderType === 'MARKET' && styles.activeOrderType,
            ]}
            onPress={() => onOrderTypeChange('MARKET')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.orderTypeText,
                orderType === 'MARKET' && styles.activeOrderTypeText,
              ]}
            >
              Market
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.orderTypeButton,
              orderType === 'LIMIT' && styles.activeOrderType,
            ]}
            onPress={() => onOrderTypeChange('LIMIT')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.orderTypeText,
                orderType === 'LIMIT' && styles.activeOrderTypeText,
              ]}
            >
              Limit
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quantity Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={onQuantityChange}
            keyboardType="numeric"
            placeholder="1"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.inputSuffix}>shares</Text>
        </View>
      </View>

      {/* Price Input (for limit orders) */}
      {orderType === 'LIMIT' && (
        <View style={styles.section}>
          <Text style={styles.label}>Limit Price</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>₹</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={onPriceChange}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  orderTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeOrderType: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  orderTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeOrderTypeText: {
    color: '#3B82F6',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  inputPrefix: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
    fontSize: 16,
    color: '#6B7280',
    zIndex: 1,
  },
  inputSuffix: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
    fontSize: 16,
    color: '#6B7280',
  },
});

export default OrderForm;
