import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  StockDetail: { stockSymbol: string; stockName: string };
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

type RouteProp = {
  params: {
    stockSymbol: string;
    stockName: string;
    currentPrice: number;
  };
};

const PlaceOrderScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { stockSymbol, stockName, currentPrice } = route.params;

  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [orderPrice, setOrderPrice] = useState(currentPrice.toString());
  const [orderTypeSelection, setOrderTypeSelection] = useState<'market' | 'limit'>('market');

  const totalValue = parseFloat(quantity) * parseFloat(orderPrice) || 0;
  const availableBalance = 10000; // Mock balance

  const handlePlaceOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }

    if (orderType === 'buy' && totalValue > availableBalance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough balance to place this order.');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Are you sure you want to ${orderType} ${quantity} shares of ${stockSymbol} at $${orderPrice}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert(
              'Order Placed',
              `Your ${orderType} order has been placed successfully!`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Home')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 0 && numValue <= 10000)) {
      setQuantity(value);
    }
  };

  const handlePriceChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 0 && numValue <= 10000)) {
      setOrderPrice(value);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Place Order</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderStockInfo = () => (
    <View style={styles.stockInfoContainer}>
      <View style={styles.stockHeader}>
        <Text style={styles.stockSymbol}>{stockSymbol}</Text>
        <Text style={styles.stockName}>{stockName}</Text>
      </View>
      <Text style={styles.currentPrice}>${currentPrice.toFixed(2)}</Text>
    </View>
  );

  const renderOrderTypeSelector = () => (
    <View style={styles.orderTypeContainer}>
      <Text style={styles.sectionTitle}>Order Type</Text>
      <View style={styles.orderTypeButtons}>
        <TouchableOpacity
          style={[
            styles.orderTypeButton,
            orderType === 'buy' && styles.orderTypeButtonActive
          ]}
          onPress={() => setOrderType('buy')}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={20} 
            color={orderType === 'buy' ? '#FFFFFF' : '#10B981'} 
          />
          <Text style={[
            styles.orderTypeText,
            orderType === 'buy' && styles.orderTypeTextActive
          ]}>
            Buy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.orderTypeButton,
            orderType === 'sell' && styles.orderTypeButtonActive
          ]}
          onPress={() => setOrderType('sell')}
        >
          <Ionicons 
            name="remove-circle-outline" 
            size={20} 
            color={orderType === 'sell' ? '#FFFFFF' : '#EF4444'} 
          />
          <Text style={[
            styles.orderTypeText,
            orderType === 'sell' && styles.orderTypeTextActive
          ]}>
            Sell
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderDetails = () => (
    <View style={styles.orderDetailsContainer}>
      <Text style={styles.sectionTitle}>Order Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={handleQuantityChange}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Price per Share</Text>
        <TextInput
          style={styles.input}
          value={orderPrice}
          onChangeText={handlePriceChange}
          placeholder="Enter price"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Value</Text>
        <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.orderSummaryContainer}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Action</Text>
        <Text style={[
          styles.summaryValue,
          { color: orderType === 'buy' ? '#10B981' : '#EF4444' }
        ]}>
          {orderType.toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Stock</Text>
        <Text style={styles.summaryValue}>{stockSymbol}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Quantity</Text>
        <Text style={styles.summaryValue}>{quantity || '0'} shares</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Price</Text>
        <Text style={styles.summaryValue}>${orderPrice || '0.00'}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total</Text>
        <Text style={styles.summaryValue}>${totalValue.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderBalanceInfo = () => (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceLabel}>Available Balance</Text>
      <Text style={styles.balanceValue}>${availableBalance.toFixed(2)}</Text>
    </View>
  );

  const renderPlaceOrderButton = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          { backgroundColor: orderType === 'buy' ? '#10B981' : '#EF4444' }
        ]}
        onPress={handlePlaceOrder}
      >
        <Ionicons 
          name={orderType === 'buy' ? 'add-circle' : 'remove-circle'} 
          size={20} 
          color="#FFFFFF" 
        />
        <Text style={styles.placeOrderButtonText}>
          Place {orderType.toUpperCase()} Order
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStockInfo()}
        {renderOrderTypeSelector()}
        {renderOrderDetails()}
        {renderOrderSummary()}
        {renderBalanceInfo()}
      </ScrollView>

      {renderPlaceOrderButton()}
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
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stockInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stockHeader: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 14,
    color: '#6B7280',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  orderTypeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  orderTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  orderTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  orderTypeButtonActive: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  orderTypeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  orderTypeTextActive: {
    color: '#FFFFFF',
  },
  orderDetailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  orderSummaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  balanceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default PlaceOrderScreen;
