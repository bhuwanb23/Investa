import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '../../components/MainHeader';
import { api } from '../../services';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const BORDER = '#e5e7eb';
const CARD_BG = '#ffffff';

interface NewsItem {
  id: number;
  stock: number;
  stock_symbol: string;
  stock_name: string;
  title: string;
  source: string;
  summary: string;
  url: string;
  published_at: string;
}

const NewsFeedScreen = ({ navigation }: any) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async (pageNum = 1, append = false) => {
    try {
      const response = await api.get('/api/news/', { params: { page: pageNum, page_size: 20 } });
      const results = response.data?.results ?? [];
      if (append) {
        setNews(prev => [...prev, ...results]);
      } else {
        setNews(results);
      }
      setHasMore(results.length === 20);
      setPage(pageNum);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(1);
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchNews(page + 1, true);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.newsCard}
      activeOpacity={0.7}
      onPress={() => item.url ? Linking.openURL(item.url) : null}
    >
      <View style={styles.newsHeader}>
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
      </View>
      <View style={styles.newsMeta}>
        <View style={styles.newsSourceTag}>
          <Text style={styles.newsSourceText}>{item.source}</Text>
        </View>
        <Text style={styles.newsTime}>{timeAgo(item.published_at)}</Text>
      </View>
      {item.summary ? (
        <Text style={styles.newsSummary} numberOfLines={3}>{item.summary}</Text>
      ) : null}
      <Text style={styles.newsStock}>Related: {item.stock_name} ({item.stock_symbol})</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <MainHeader title="News Feed" iconName="newspaper" showBackButton onBackPress={() => navigation.goBack()} />
      {loading && news.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="newspaper-outline" size={48} color={TEXT_MUTED} />
              <Text style={styles.emptyText}>No news available yet.</Text>
            </View>
          }
          ListFooterComponent={hasMore && news.length > 0 ? (
            <ActivityIndicator style={{ padding: 16 }} size="small" color={PRIMARY} />
          ) : null}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PAGE_BG },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  list: { padding: 12, paddingBottom: 24 },
  newsCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  newsHeader: { marginBottom: 8 },
  newsTitle: { color: TEXT_DARK, fontSize: 15, fontWeight: '800', lineHeight: 20 },
  newsMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  newsSourceTag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newsSourceText: { color: PRIMARY, fontSize: 11, fontWeight: '700' },
  newsTime: { color: TEXT_MUTED, fontSize: 11 },
  newsSummary: { color: TEXT_MUTED, fontSize: 13, lineHeight: 18, marginBottom: 6 },
  newsStock: { color: '#9CA3AF', fontSize: 11, fontStyle: 'italic' },
  emptyText: { color: TEXT_MUTED, fontSize: 14, marginTop: 12 },
});

export default NewsFeedScreen;
