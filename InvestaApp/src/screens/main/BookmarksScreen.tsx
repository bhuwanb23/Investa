import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'bookmark' },
    { id: 'lessons', name: 'Lessons', icon: 'school' },
    { id: 'articles', name: 'Articles', icon: 'document-text' },
    { id: 'videos', name: 'Videos', icon: 'play-circle' },
  ];

  const bookmarkedItems = [
    {
      id: 1,
      type: 'lessons',
      title: 'What is a Stock?',
      description: 'Learn the fundamental concept of stocks and how they represent ownership in a company.',
      category: 'Stock Market Basics',
      duration: '15 min',
      icon: 'business',
      color: '#3B82F6',
      bookmarkedAt: '2 days ago',
    },
    {
      id: 2,
      type: 'articles',
      title: 'SEBI Guidelines for Retail Investors',
      description: 'Important regulatory updates and guidelines that every retail investor should know.',
      category: 'Regulatory',
      duration: '8 min read',
      icon: 'document-text',
      color: '#DC2626',
      bookmarkedAt: '1 week ago',
    },
    {
      id: 3,
      type: 'videos',
      title: 'Technical Analysis Fundamentals',
      description: 'Master the basics of chart reading and technical indicators.',
      category: 'Technical Analysis',
      duration: '25 min',
      icon: 'analytics',
      color: '#7C3AED',
      bookmarkedAt: '3 days ago',
    },
    {
      id: 4,
      type: 'lessons',
      title: 'Portfolio Diversification',
      description: 'Understand the importance of diversification and how to build a balanced portfolio.',
      category: 'Portfolio Management',
      duration: '20 min',
      icon: 'pie-chart',
      color: '#F59E0B',
      bookmarkedAt: '5 days ago',
    },
    {
      id: 5,
      type: 'articles',
      title: 'Market Psychology and Emotions',
      description: 'How to control emotions and make rational investment decisions.',
      category: 'Psychology',
      duration: '12 min read',
      icon: 'brain',
      color: '#10B981',
      bookmarkedAt: '2 weeks ago',
    },
    {
      id: 6,
      type: 'videos',
      title: 'Risk Management Strategies',
      description: 'Essential risk management techniques for protecting your capital.',
      category: 'Risk Management',
      duration: '18 min',
      icon: 'shield-checkmark',
      color: '#EF4444',
      bookmarkedAt: '1 week ago',
    },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? bookmarkedItems 
    : bookmarkedItems.filter(item => item.type === selectedCategory);

  const renderCategoryButton = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon as any} 
        size={20} 
        color={selectedCategory === category.id ? 'white' : '#6B7280'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.selectedCategoryText,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderBookmarkItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.bookmarkItem}
      onPress={() => {
        // Navigate based on item type
        if (item.type === 'lessons') {
          navigation.navigate('ModuleDetail', { moduleId: item.id });
        } else if (item.type === 'videos') {
          navigation.navigate('VideoPlayer', { videoId: item.id });
        } else {
          navigation.navigate('ArticleDetail', { articleId: item.id });
        }
      }}
      activeOpacity={0.8}
    >
      <View style={styles.bookmarkHeader}>
        <View style={[styles.itemIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={24} color={item.color} />
        </View>
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.itemMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="folder-outline" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{item.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons 
                name={item.type === 'videos' ? 'time-outline' : 'document-text'} 
                size={16} 
                color="#6B7280" 
              />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark" size={20} color={item.color} />
        </TouchableOpacity>
      </View>

      <View style={styles.bookmarkFooter}>
        <Text style={styles.bookmarkedAt}>Bookmarked {item.bookmarkedAt}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={16} color="#6B7280" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="remove-circle-outline" size={16} color="#EF4444" />
            <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="funnel-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={({ item }) => renderBookmarkItem(item)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bookmarksList}
        showsVerticalScrollIndicator={false}
      />

      {filteredItems.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyStateTitle}>No Bookmarks Yet</Text>
          <Text style={styles.emptyStateMessage}>
            {selectedCategory === 'all' 
              ? 'Start bookmarking your favorite lessons, articles, and videos to access them quickly later.'
              : `No ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} bookmarked yet.`
            }
          </Text>
          
          {selectedCategory !== 'all' && (
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={styles.browseButtonText}>Browse All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  sortButton: {
    padding: 8,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  selectedCategory: {
    backgroundColor: '#0891B2',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: 'white',
  },
  bookmarksList: {
    padding: 20,
  },
  bookmarkItem: {
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
  bookmarkHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 22,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bookmarkedAt: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#0891B2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BookmarksScreen;
