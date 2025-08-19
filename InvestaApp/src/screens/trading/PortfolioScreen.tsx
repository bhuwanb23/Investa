import React, { useState } from 'react';
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
import { PORTFOLIO_DATA, PORTFOLIO_HOLDINGS, SECTOR_ALLOCATION } from './constants/tradingConstants';

// Define navigation types
type RootStackParamList = {
  StockDetail: { stockSymbol: string; stockName: string };
  Home: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const PortfolioScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTab, setSelectedTab] = useState('Holdings');

  const tabs = ['Holdings', 'Order History', 'Leaderboard'];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.headerTitle}>Portfolio</Text>
            <Text style={styles.welcomeText}>Welcome back, Sarah</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.trophyButton}>
            <Ionicons name="trophy" size={16} color="#6366F1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.portfolioSummary}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
            <Text style={styles.summaryValue}>₹{PORTFOLIO_DATA.totalValue}</Text>
          </View>
          <View style={styles.returnBadge}>
            <Text style={styles.returnText}>+12.5%</Text>
          </View>
        </View>
        <View style={styles.summaryDetails}>
          <View>
            <Text style={styles.summaryDetailLabel}>Invested</Text>
            <Text style={styles.summaryDetailValue}>₹{PORTFOLIO_DATA.totalInvested}</Text>
          </View>
          <View>
            <Text style={styles.summaryDetailLabel}>Returns</Text>
            <Text style={styles.returnsValue}>+₹{PORTFOLIO_DATA.totalProfit}</Text>
          </View>
        </View>
      </View>
    </View>
  );

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

  const renderAchievementsSection = () => (
    <View style={styles.achievementsSection}>
      <View style={styles.achievementsHeader}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <Text style={styles.achievementsCount}>3/5 unlocked</Text>
      </View>
      <View style={styles.achievementsGrid}>
        <View style={styles.achievementCard}>
          <Ionicons name="medal" size={16} color="#EAB308" />
          <Text style={styles.achievementText}>First Investment</Text>
        </View>
        <View style={styles.achievementCard}>
          <Ionicons name="trending-up" size={16} color="#22C55E" />
          <Text style={styles.achievementText}>10% Gains</Text>
        </View>
        <View style={styles.achievementCard}>
          <Ionicons name="pie-chart" size={16} color="#3B82F6" />
          <Text style={styles.achievementText}>Diversified</Text>
        </View>
      </View>
    </View>
  );

  const renderDiversificationChart = () => (
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
          {SECTOR_ALLOCATION.map((sector) => (
            <View key={sector.sector} style={styles.sectorItem}>
              <View style={[styles.sectorColor, { backgroundColor: sector.color }]} />
              <Text style={styles.sectorName}>{sector.sector}</Text>
              <Text style={styles.sectorWeight}>{sector.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderHoldingsSection = () => (
    <View style={styles.holdingsSection}>
      <Text style={styles.sectionTitle}>Holdings ({PORTFOLIO_HOLDINGS.length})</Text>
      {PORTFOLIO_HOLDINGS.map((holding) => (
        <TouchableOpacity
          key={holding.symbol}
          style={styles.holdingItem}
          onPress={() => navigation.navigate('StockDetail', { 
            stockSymbol: holding.symbol, 
            stockName: holding.name 
          })}
        >
          <View style={styles.holdingHeader}>
            <View style={styles.stockInfo}>
              <Text style={styles.stockSymbol}>{holding.symbol}</Text>
              <Text style={styles.stockName} numberOfLines={1}>{holding.name}</Text>
              <Text style={styles.stockSector}>Oil & Gas</Text>
            </View>
            <View style={styles.stockPrice}>
              <Text style={styles.currentPrice}>₹{holding.currentPrice}</Text>
              <Text style={styles.quantity}>{holding.quantity} shares</Text>
            </View>
          </View>

          <View style={styles.holdingDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Market Value:</Text>
              <Text style={styles.detailValue}>₹{holding.marketValue}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Avg Price:</Text>
              <Text style={styles.detailValue}>₹{holding.avgPrice}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight:</Text>
              <Text style={styles.detailValue}>11.4%</Text>
            </View>
          </View>

          <View style={styles.pnlSection}>
            <View style={styles.pnlInfo}>
              <Text style={styles.pnlLabel}>Unrealized P&L</Text>
              <View style={styles.pnlValueRow}>
                <Ionicons 
                  name={holding.isPositive ? "trending-up" : "trending-down"} 
                  size={14} 
                  color={holding.isPositive ? '#10B981' : '#EF4444'} 
                />
                <Text style={[
                  styles.pnlAmount,
                  { color: holding.isPositive ? '#10B981' : '#EF4444' }
                ]}>
                  {holding.profit}
                </Text>
              </View>
            </View>
            <Text style={[
              styles.pnlPercent,
              { color: holding.isPositive ? '#10B981' : '#EF4444' }
            ]}>
              {holding.profitPercentage}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderNavigationTabs()}
        {renderAchievementsSection()}
        {renderDiversificationChart()}
        {renderHoldingsSection()}
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trophyButton: {
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 20,
  },
  notificationButton: {
    padding: 4,
  },
  portfolioSummary: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 16,
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
});

export default PortfolioScreen;
