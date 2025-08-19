import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTradingData } from './hooks/useTradingData';
import {
  StockCard,
  MarketSummary,
  CategoryTabs,
  SearchBar,
} from './components';
import MainHeader from '../../components/MainHeader';

// Define navigation types
type RootStackParamList = {
  StockDetail: { stockSymbol: string; stockName: string };
  Home: undefined;
  Trading: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const MarketWatchlistScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    stocks,
    searchQuery,
    selectedCategory,
    searchStocks,
    toggleFavorite,
    getStocksByCategory,
    setSelectedCategory,
  } = useTradingData();

  const handleStockPress = (stock: any) => {
    navigation.navigate('StockDetail', {
      stockSymbol: stock.symbol,
      stockName: stock.name,
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchClear = () => {
    searchStocks('');
  };

  const filteredStocks = getStocksByCategory(selectedCategory);

  const renderStockItem = ({ item }: { item: any }) => (
    <StockCard
      stock={item}
      onPress={handleStockPress}
      onToggleFavorite={toggleFavorite}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search" size={48} color="#9CA3AF" />
      <Text style={styles.emptyStateTitle}>No stocks found</Text>
      <Text style={styles.emptyStateSubtitle}>
        Try adjusting your search or category filter
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MainHeader title="Watchlist" iconName="trending-up" showBackButton onBackPress={() => navigation.navigate('Trading')} />
        <SearchBar
          value={searchQuery}
          onChangeText={searchStocks}
          onClear={handleSearchClear}
        />
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Market Summary */}
        <View style={styles.section}>
          <MarketSummary selectedIndex={selectedCategory} />
        </View>

        {/* Stock List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'Favorites' ? 'Favorite Stocks' : 'Top Stocks'}
            </Text>
            <Text style={styles.stockCount}>{filteredStocks.length} stocks</Text>
          </View>

          {filteredStocks.length > 0 ? (
            <FlatList
              data={filteredStocks}
              renderItem={renderStockItem}
              keyExtractor={(item) => item.symbol}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  stockCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#1F2937',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default MarketWatchlistScreen;
