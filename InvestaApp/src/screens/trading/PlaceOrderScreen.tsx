import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTradingData } from './hooks/useTradingData';
import { placeOrder, fetchMyPortfolio } from './utils/tradingApi';
import {
  OrderTypeToggle,
  OrderForm,
  OrderPreview,
  SuccessModal,
} from './components';
import MainHeader from '../../components/MainHeader';
import { useTranslation } from '../../language';

// Define navigation types
type RootStackParamList = {
  StockDetail: { stockSymbol: string; stockName: string };
  PlaceOrder: { stockSymbol: string; stockName: string; currentPrice: number; initialSide?: 'BUY' | 'SELL' };
  Home: undefined;
  Trading: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const PlaceOrderScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'PlaceOrder'>>();
  const { stockSymbol, stockName, currentPrice, initialSide } = route.params;
  const { getStockBySymbol } = useTradingData();
  const { t } = useTranslation();

  const [isBuyMode, setIsBuyMode] = useState(initialSide === 'SELL' ? false : true);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState(currentPrice.toString());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentCash, setCurrentCash] = useState<number | null>(null);
  const [cashLoaded, setCashLoaded] = useState(false);

  const loadPortfolio = useCallback(async () => {
    try {
      const portfolioData = await fetchMyPortfolio();
      if (portfolioData && portfolioData.cash_balance !== undefined) {
        setCurrentCash(Number(portfolioData.cash_balance));
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setCashLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // Refetch cash balance when the screen is focused (e.g. after returning from elsewhere)
  useFocusEffect(
    useCallback(() => {
      loadPortfolio();
    }, [loadPortfolio])
  );

  // Get stock data from the loaded list; if not found, render an error state
  const stock = getStockBySymbol(stockSymbol);
  const stockNotFound = !stock;

  // Calculate costs
  const quantityNum = parseInt(quantity) || 1;
  const priceNum = parseFloat(price) || currentPrice;
  const estimatedCost = quantityNum * priceNum;
  const commission = 0;
  const totalCost = estimatedCost + commission;
  const newCash = currentCash !== null
    ? (isBuyMode ? currentCash - totalCost : currentCash + totalCost)
    : null;

  const handleBack = () => {
    navigation.navigate('Trading');
  };

  const handleOrderTypeChange = (type: 'MARKET' | 'LIMIT') => {
    setOrderType(type);
    if (type === 'MARKET') {
      setPrice(currentPrice.toString());
    }
  };

  const handleQuantityChange = (newQuantity: string) => {
    setQuantity(newQuantity);
  };

  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
  };

  const handlePlaceOrder = async () => {
    if (quantityNum <= 0) {
      Alert.alert(t.invalidQuantity, t.pleaseEnterValidQuantity);
      return;
    }

    if (orderType === 'LIMIT' && parseFloat(price) <= 0) {
      Alert.alert(t.invalidPrice, t.pleaseEnterValidLimitPrice);
      return;
    }

    if (!stock?.id) {
      Alert.alert(t.orderFailed, t.unableToPlaceOrderNow);
      return;
    }

    try {
      await placeOrder({
        stock: stock.id,
        side: isBuyMode ? 'BUY' : 'SELL',
        order_type: orderType,
        quantity: quantityNum,
        price: orderType === 'LIMIT' ? priceNum : undefined,
      });
      setShowSuccessModal(true);
    } catch (e: any) {
      Alert.alert(t.orderFailed, e?.response?.data?.detail || t.unableToPlaceOrderNow);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  if (stockNotFound) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MainHeader title={t.placeOrder} iconName="swap-vertical" showBackButton onBackPress={handleBack} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text style={styles.notFoundTitle}>{t.stockNotFound}</Text>
          <Text style={styles.notFoundSubtext}>
            {t.unableToLoadStock}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MainHeader title={t.placeOrder} iconName="swap-vertical" showBackButton onBackPress={handleBack} />
      </View>

      {/* Stock Price Reference */}
      <View style={styles.stockPriceSection}>
        <View style={styles.stockInfo}>
          <View>
            <Text style={styles.stockSymbol}>{stock.symbol}</Text>
            <Text style={styles.stockName}>{stock.name}</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.currentPrice}>₹{currentPrice.toFixed(2)}</Text>
            <View style={styles.changeContainer}>
              <Ionicons
                name={stock.isPositive ? "arrow-up" : "arrow-down"}
                size={12}
                color={stock.isPositive ? "#16A34A" : "#DC2626"}
              />
              <Text style={[
                styles.changeText,
                { color: stock.isPositive ? "#16A34A" : "#DC2626" }
              ]}>
                {stock.changeValue} ({stock.change})
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Type Toggle */}
        <OrderTypeToggle
          isBuyMode={isBuyMode}
          onToggle={setIsBuyMode}
        />

        {/* Order Form */}
        <OrderForm
          orderType={orderType}
          quantity={quantity}
          price={price}
          onOrderTypeChange={handleOrderTypeChange}
          onQuantityChange={handleQuantityChange}
          onPriceChange={handlePriceChange}
        />

        {/* Order Preview */}
        {cashLoaded && currentCash !== null ? (
          <OrderPreview
            isBuyMode={isBuyMode}
            quantity={quantityNum}
            price={priceNum}
            estimatedCost={estimatedCost}
            commission={commission}
            totalCost={totalCost}
            currentCash={currentCash}
            newCash={newCash ?? currentCash}
          />
        ) : (
          <View style={styles.loadingPreview}>
            <Text style={styles.loadingText}>{t.loadingPortfolio}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            {
              backgroundColor: isBuyMode ? '#10B981' : '#EF4444',
              opacity: cashLoaded && stock?.id ? 1 : 0.5,
            }
          ]}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
          disabled={!cashLoaded || !stock?.id}
        >
          <Text style={styles.placeOrderText}>
            {isBuyMode ? t.buy : t.sell} {quantityNum} {quantityNum > 1 ? t.shares : t.share}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleCloseModal}
        stockSymbol={stockSymbol}
        quantity={quantityNum}
        isBuyMode={isBuyMode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stockPriceSection: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockSymbol: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  stockName: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeOrderButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingPreview: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default PlaceOrderScreen;
