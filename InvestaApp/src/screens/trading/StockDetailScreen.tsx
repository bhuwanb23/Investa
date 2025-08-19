import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTradingData } from './hooks/useTradingData';
import {
  StockDetailHeader,
  ChartSection,
  CollapsibleSection,
  TradingButtons,
} from './components';
import { STOCK_DETAIL_DATA } from './constants/tradingConstants';
import MainHeader from '../../components/MainHeader';

// Define navigation types
type RootStackParamList = {
  PlaceOrder: { stockSymbol: string; stockName: string; currentPrice: number };
  Home: undefined;
  StockDetail: { stockSymbol: string; stockName: string };
  Trading: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const StockDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'StockDetail'>>();
  const { stockSymbol, stockName } = route.params;
  const { getStockBySymbol } = useTradingData();

  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Get stock data from the hook
  const stock = getStockBySymbol(stockSymbol) || {
    symbol: stockSymbol,
    name: stockName,
    price: '₹2,456.80',
    change: '+2.45%',
    changeValue: '+58.75',
    isPositive: true,
    exchange: 'NSE',
    isFavorite: false,
    volume: '2.5M',
    marketCap: '₹16.2T',
  };

  const handleBack = () => {
    navigation.navigate('Trading');
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks',
      `${stock.symbol} has been ${isBookmarked ? 'removed from' : 'added to'} your bookmarks.`
    );
  };

  const handleShare = () => {
    Alert.alert('Share', `Sharing ${stock.symbol} stock details`);
  };

  const handleBuy = () => {
    const currentPrice = parseFloat(stock.price.replace('₹', '').replace(',', ''));
    navigation.navigate('PlaceOrder', {
      stockSymbol: stock.symbol,
      stockName: stock.name,
      currentPrice,
    });
  };

  const handleSell = () => {
    Alert.alert(
      'Sell Stock',
      `Are you sure you want to sell ${stock.symbol}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sell', onPress: () => console.log('Sell stock') }
      ]
    );
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={stock.name} iconName="trending-up" showBackButton onBackPress={handleBack} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ChartSection
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={handleTimeframeChange}
        />

        <View style={styles.sections}>
          <CollapsibleSection title="Company Profile">
            <Text style={styles.description}>
              {STOCK_DETAIL_DATA.companyProfile.description}
            </Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Founded</Text>
                <Text style={styles.infoValue}>{STOCK_DETAIL_DATA.companyProfile.founded}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Employees</Text>
                <Text style={styles.infoValue}>{STOCK_DETAIL_DATA.companyProfile.employees}</Text>
              </View>
            </View>
          </CollapsibleSection>

          <CollapsibleSection title="News Highlights">
            {STOCK_DETAIL_DATA.news.map((newsItem) => (
              <View key={newsItem.id} style={styles.newsItem}>
                <View style={styles.newsImage}>
                  {/* Placeholder for news image */}
                </View>
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle} numberOfLines={2}>
                    {newsItem.title}
                  </Text>
                  <Text style={styles.newsMeta}>
                    {newsItem.timeAgo} • {newsItem.source}
                  </Text>
                </View>
              </View>
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Key Fundamentals">
            <View style={styles.fundamentalsGrid}>
              {STOCK_DETAIL_DATA.fundamentals.map((fundamental, index) => (
                <View key={index} style={styles.fundamentalItem}>
                  <Text style={styles.fundamentalLabel}>{fundamental.label}</Text>
                  <Text style={styles.fundamentalValue}>{fundamental.value}</Text>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        </View>

        {/* Bottom spacing for trading buttons */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TradingButtons onBuy={handleBuy} onSell={handleSell} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  sections: {
    marginTop: 1, // Small gap between sections
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  newsItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  newsImage: {
    width: 64,
    height: 48,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    flexShrink: 0,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  newsMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  fundamentalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  fundamentalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '48%',
  },
  fundamentalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  fundamentalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  bottomSpacing: {
    height: 100, // Space for trading buttons
  },
});

export default StockDetailScreen;
