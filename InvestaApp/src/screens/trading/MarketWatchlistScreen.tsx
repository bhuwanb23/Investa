import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Define navigation types
type RootStackParamList = {
  StockDetail: { stockSymbol: string; stockName: string };
  Home: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const MarketWatchlistScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('nifty');

  const indices = [
    { id: 'nifty', name: 'NIFTY 50', value: '22,419.95', change: '+0.85%', color: '#10B981' },
    { id: 'sensex', name: 'SENSEX', value: '73,852.94', change: '+0.78%', color: '#10B981' },
    { id: 'banknifty', name: 'BANK NIFTY', value: '47,852.30', change: '+1.25%', color: '#10B981' },
  ];

  const watchlistStocks = [
    {
      id: 1,
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      price: '2,847.50',
      change: '+2.15%',
      changeValue: '+59.85',
      volume: '2.5M',
      marketCap: '₹19.2T',
      color: '#10B981',
      sector: 'Oil & Gas',
    },
    {
      id: 2,
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: '3,892.75',
      change: '-0.85%',
      changeValue: '-33.45',
      volume: '1.8M',
      marketCap: '₹14.1T',
      color: '#EF4444',
      sector: 'IT',
    },
    {
      id: 3,
      symbol: 'HDFC',
      name: 'HDFC Bank Ltd',
      price: '1,647.30',
      change: '+1.45%',
      changeValue: '+23.55',
      volume: '3.2M',
      marketCap: '₹9.8T',
      color: '#10B981',
      sector: 'Banking',
    },
    {
      id: 4,
      symbol: 'INFY',
      name: 'Infosys Ltd',
      price: '1,485.90',
      change: '-0.65%',
      changeValue: '-9.75',
      volume: '2.1M',
      marketCap: '₹6.2T',
      color: '#EF4444',
      sector: 'IT',
    },
    {
      id: 5,
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Ltd',
      price: '1,092.45',
      change: '+2.85%',
      changeValue: '+30.25',
      volume: '4.5M',
      marketCap: '₹7.8T',
      color: '#10B981',
      sector: 'Banking',
    },
    {
      id: 6,
      symbol: 'HINDUNILVR',
      name: 'Hindustan Unilever Ltd',
      price: '2,547.80',
      change: '+0.95%',
      changeValue: '+23.90',
      volume: '1.2M',
      marketCap: '₹5.9T',
      color: '#10B981',
      sector: 'FMCG',
    },
  ];

  const filteredStocks = watchlistStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIndexCard = (index: any) => (
    <TouchableOpacity
      key={index.id}
      style={[
        styles.indexCard,
        selectedIndex === index.id && styles.selectedIndex,
      ]}
      onPress={() => setSelectedIndex(index.id)}
    >
      <Text style={styles.indexName}>{index.name}</Text>
      <Text style={styles.indexValue}>{index.value}</Text>
      <Text style={[styles.indexChange, { color: index.color }]}>
        {index.change}
      </Text>
    </TouchableOpacity>
  );

  const renderStockItem = (stock: any) => (
    <TouchableOpacity
      key={stock.id}
      style={styles.stockItem}
      onPress={() => navigation.navigate('StockDetail', { 
        stockSymbol: stock.symbol, 
        stockName: stock.name 
      })}
      activeOpacity={0.8}
    >
      <View style={styles.stockHeader}>
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockName} numberOfLines={1}>
            {stock.name}
          </Text>
          <Text style={styles.stockSector}>{stock.sector}</Text>
        </View>
        
        <View style={styles.stockPrice}>
          <Text style={styles.priceText}>₹{stock.price}</Text>
          <Text style={[styles.changeText, { color: stock.color }]}>
            {stock.change}
          </Text>
          <Text style={[styles.changeValueText, { color: stock.color }]}>
            {stock.changeValue}
          </Text>
        </View>
      </View>

      <View style={styles.stockFooter}>
        <View style={styles.stockMeta}>
          <Text style={styles.metaLabel}>Volume:</Text>
          <Text style={styles.metaValue}>{stock.volume}</Text>
        </View>
        <View style={styles.stockMeta}>
          <Text style={styles.metaLabel}>Market Cap:</Text>
          <Text style={styles.metaValue}>{stock.marketCap}</Text>
        </View>
        <TouchableOpacity style={styles.tradeButton}>
          <Text style={styles.tradeButtonText}>Trade</Text>
          <Ionicons name="arrow-forward" size={16} color="#0891B2" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Watchlist</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.indicesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.indicesScroll}
        >
          {indices.map(renderIndexCard)}
        </ScrollView>
      </View>

      <View style={styles.stocksSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Watchlist</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={20} color="#0891B2" />
            <Text style={styles.addButtonText}>Add Stock</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredStocks}
          renderItem={({ item }) => renderStockItem(item)}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.stocksList}
        />
      </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  indicesSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  indicesScroll: {
    paddingHorizontal: 20,
  },
  indexCard: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIndex: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0891B2',
  },
  indexName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  indexValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  indexChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  stocksSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: '#0891B2',
    fontWeight: '600',
  },
  stocksList: {
    paddingBottom: 20,
  },
  stockItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stockInfo: {
    flex: 1,
    marginRight: 16,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  stockSector: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  stockPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  changeValueText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  stockMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaValue: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  tradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  tradeButtonText: {
    fontSize: 12,
    color: '#0891B2',
    fontWeight: '600',
  },
});

export default MarketWatchlistScreen;
