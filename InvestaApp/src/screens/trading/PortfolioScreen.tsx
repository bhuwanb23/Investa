import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  fetchMyPortfolio, 
  fetchPortfolioHoldings, 
  fetchOrderHistory,
  fetchStocks 
} from './utils/tradingApi';
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

const PortfolioScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTab, setSelectedTab] = useState('Holdings');
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Holdings', 'Order History', 'Leaderboard'];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  // Fetch portfolio data on component mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [portfolioRes, holdingsRes, ordersRes, stocksRes] = await Promise.all([
          fetchMyPortfolio(),
          fetchPortfolioHoldings(),
          fetchOrderHistory(),
          fetchStocks()
        ]);
        
        if (!mounted) return;
        
        setPortfolioData(portfolioRes);
        setHoldings(holdingsRes);
        setOrders(ordersRes);
        setStocks(stocksRes);
      } catch (error) {
        console.error('PortfolioScreen: Error fetching data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const renderHeader = () => {
    // Calculate portfolio statistics from real data
    const totalValue = portfolioData?.total_value || 0;
    const totalInvested = portfolioData?.total_invested || 0;
    const totalReturns = totalValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : '0.0';
    
    return (
      <View style={styles.header}>
        <MainHeader title="Portfolio" iconName="wallet" showBackButton onBackPress={() => navigation.navigate('Trading')} />
        
        <View style={styles.portfolioSummary}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
              <Text style={styles.summaryValue}>₹{totalValue.toLocaleString()}</Text>
            </View>
            <View style={styles.returnBadge}>
              <Text style={styles.returnText}>{totalReturns >= 0 ? '+' : ''}{returnPercentage}%</Text>
            </View>
          </View>
          <View style={styles.summaryDetails}>
            <View>
              <Text style={styles.summaryDetailLabel}>Invested</Text>
              <Text style={styles.summaryDetailValue}>₹{totalValue.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.summaryDetailLabel}>Returns</Text>
              <Text style={[styles.returnsValue, { color: totalReturns >= 0 ? '#86EFAC' : '#FCA5A5' }]}>
                {totalReturns >= 0 ? '+' : ''}₹{totalReturns.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderNavigationTabs = () => (
    <View style={styles.navigationTabs}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            selectedTab === tab && styles.tabButtonActive
          ]}
          onPress={() => handleTabChange(tab)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextActive
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAchievementsSection = () => {
    // Calculate achievements based on real data
    const hasInvestments = holdings.length > 0;
    const hasPositiveReturns = portfolioData?.total_value > portfolioData?.total_invested;
    const isDiversified = holdings.length >= 3;
    
    const achievements = [
      { unlocked: hasInvestments, icon: "medal", text: "First Investment", color: "#EAB308" },
      { unlocked: hasPositiveReturns, icon: "trending-up", text: "Positive Returns", color: "#22C55E" },
      { unlocked: isDiversified, icon: "pie-chart", text: "Diversified", color: "#3B82F6" },
    ];
    
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    return (
      <View style={styles.achievementsSection}>
        <View style={styles.achievementsHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.achievementsCount}>{unlockedCount}/{achievements.length} unlocked</Text>
        </View>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <View 
              key={index} 
              style={[
                styles.achievementCard,
                { 
                  backgroundColor: achievement.unlocked ? '#FEF3C7' : '#F3F4F6',
                  borderColor: achievement.unlocked ? '#FDE68A' : '#E5E7EB'
                }
              ]}
            >
              <Ionicons 
                name={achievement.icon as any} 
                size={16} 
                color={achievement.unlocked ? achievement.color : '#9CA3AF'} 
              />
              <Text style={[
                styles.achievementText,
                { color: achievement.unlocked ? '#92400E' : '#6B7280' }
              ]}>
                {achievement.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderDiversificationChart = () => {
    // Calculate sector allocation from real holdings
    const sectorAllocation = holdings.reduce((acc: any, holding: any) => {
      const sector = holding.sector || 'Other';
      const value = (holding.current_price || 0) * (holding.quantity || 0);
      
      if (!acc[sector]) {
        acc[sector] = { value: 0, count: 0 };
      }
      acc[sector].value += value;
      acc[sector].count += 1;
      
      return acc;
    }, {});
    
    const totalValue = Object.values(sectorAllocation).reduce((sum: any, sector: any) => sum + sector.value, 0);
    const sectors = Object.entries(sectorAllocation).map(([sector, data]: [string, any]) => ({
      sector,
      percentage: totalValue > 0 ? Math.round((data.value / totalValue) * 100) : 0,
      count: data.count,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    })).sort((a, b) => b.percentage - a.percentage);
    
    return (
      <View style={styles.diversificationChart}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Portfolio Breakdown</Text>
          <Ionicons name="pie-chart" size={20} color="#9CA3AF" />
        </View>
        <View style={styles.chartContent}>
          <View style={styles.pieChart}>
            <Ionicons name="pie-chart-outline" size={48} color="#6B7280" />
            <Text style={styles.pieChartText}>Chart</Text>
          </View>
          <View style={styles.sectorList}>
            {sectors.length > 0 ? sectors.map((sector, index) => (
              <View key={sector.sector} style={styles.sectorItem}>
                <View style={[styles.sectorColor, { backgroundColor: sector.color }]} />
                <Text style={styles.sectorName}>{sector.sector}</Text>
                <Text style={styles.sectorWeight}>{sector.percentage}%</Text>
              </View>
            )) : (
              <Text style={styles.sectorName}>No holdings yet</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHoldingsSection = () => {
    if (holdings.length === 0) {
      return (
        <View style={styles.holdingsSection}>
          <Text style={styles.sectionTitle}>Holdings (0)</Text>
          <View style={styles.emptyHoldings}>
            <Ionicons name="wallet-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No holdings yet</Text>
            <Text style={styles.emptySubtext}>Start trading to build your portfolio</Text>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.holdingsSection}>
        <Text style={styles.sectionTitle}>Holdings ({holdings.length})</Text>
        {holdings.map((holding) => {
          const currentPrice = holding.current_price || 0;
          const avgPrice = holding.average_price || 0;
          const quantity = holding.quantity || 0;
          const marketValue = currentPrice * quantity;
          const totalCost = avgPrice * quantity;
          const unrealizedPnL = marketValue - totalCost;
          const pnlPercentage = totalCost > 0 ? ((unrealizedPnL / totalCost) * 100).toFixed(1) : '0.0';
          const isPositive = unrealizedPnL >= 0;
          
          // Find stock details from stocks array
          const stock = stocks.find(s => s.id === holding.stock_id);
          const symbol = stock?.symbol || holding.symbol || 'N/A';
          const name = stock?.name || holding.name || 'Unknown Stock';
          const sector = stock?.sector || 'Other';
          
          return (
            <TouchableOpacity
              key={holding.id || holding.symbol}
              style={styles.holdingItem}
              onPress={() => navigation.navigate('StockDetail', { 
                stockSymbol: symbol, 
                stockName: name 
              })}
            >
              <View style={styles.holdingHeader}>
                <View style={styles.stockInfo}>
                  <Text style={styles.stockSymbol}>{symbol}</Text>
                  <Text style={styles.stockName} numberOfLines={1}>{name}</Text>
                  <Text style={styles.stockSector}>{sector}</Text>
                </View>
                <View style={styles.stockPrice}>
                  <Text style={styles.currentPrice}>₹{currentPrice.toFixed(2)}</Text>
                  <Text style={styles.quantity}>{quantity} shares</Text>
                </View>
              </View>

              <View style={styles.holdingDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Market Value:</Text>
                  <Text style={styles.detailValue}>₹{marketValue.toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Avg Price:</Text>
                  <Text style={styles.detailValue}>₹{avgPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight:</Text>
                  <Text style={styles.detailValue}>
                    {portfolioData?.total_value > 0 ? ((marketValue / portfolioData.total_value) * 100).toFixed(1) : '0.0'}%
                  </Text>
                </View>
              </View>

              <View style={styles.pnlSection}>
                <View style={styles.pnlInfo}>
                  <Text style={styles.pnlLabel}>Unrealized P&L</Text>
                  <View style={styles.pnlValueRow}>
                    <Ionicons 
                      name={isPositive ? "trending-up" : "trending-down"} 
                      size={14} 
                      color={isPositive ? '#10B981' : '#EF4444'} 
                    />
                    <Text style={[
                      styles.pnlAmount,
                      { color: isPositive ? '#10B981' : '#EF4444' }
                    ]}>
                      {isPositive ? '+' : ''}₹{unrealizedPnL.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.pnlPercent,
                  { color: isPositive ? '#10B981' : '#EF4444' }
                ]}>
                  {isPositive ? '+' : ''}{pnlPercentage}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading portfolio...</Text>
          </View>
        ) : (
          <>
            {renderNavigationTabs()}
            {renderAchievementsSection()}
            {renderDiversificationChart()}
            {renderHoldingsSection()}
          </>
        )}
      </ScrollView>
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
  portfolioSummary: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  returnBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  returnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryDetailLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  summaryDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  returnsValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#86EFAC',
  },
  content: {
    flex: 1,
  },
  navigationTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  achievementsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  achievementsCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    gap: 4,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
  },
  diversificationChart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  pieChartText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectorList: {
    flex: 1,
  },
  sectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectorColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sectorName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  sectorWeight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  holdingsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  holdingItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stockInfo: {
    flex: 1,
    marginRight: 16,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  stockSector: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stockPrice: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  holdingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  pnlSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pnlInfo: {
    flex: 1,
  },
  pnlLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  pnlValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pnlAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  pnlPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHoldings: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default PortfolioScreen;
