import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import MainHeader from '../../components/MainHeader';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import LogoLoader from '../../components/LogoLoader';

const { width } = Dimensions.get('window');

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bootLoader, setBootLoader] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBootLoader(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filterTabs = [
    { id: 'all', name: 'All' },
    { id: 'in-progress', name: 'In Progress' },
    { id: 'completed', name: 'Completed' },
    { id: 'recent', name: 'Recent' },
    { id: 'math', name: 'Math' },
    { id: 'science', name: 'Science' },
  ];

  const bookmarkedLessons = [
    {
      id: 1,
      title: 'Advanced Algebra: Quadratic Equations',
      category: 'Mathematics',
      addedAt: '2 days ago',
      progress: 65,
      icon: 'calculator',
      iconColor: '#3B82F6',
      iconBg: '#DBEAFE',
    },
    {
      id: 2,
      title: 'Photosynthesis Process',
      category: 'Biology',
      addedAt: '1 week ago',
      progress: 100,
      icon: 'leaf',
      iconColor: '#10B981',
      iconBg: '#D1FAE5',
    },
    {
      id: 3,
      title: 'Chemical Bonding Basics',
      category: 'Chemistry',
      addedAt: '3 days ago',
      progress: 25,
      icon: 'flask',
      iconColor: '#8B5CF6',
      iconBg: '#EDE9FE',
    },
    {
      id: 4,
      title: 'World War II Timeline',
      category: 'History',
      addedAt: '5 days ago',
      progress: 45,
      icon: 'globe',
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7',
    },
    {
      id: 5,
      title: "Shakespeare's Hamlet Analysis",
      category: 'Literature',
      addedAt: '1 week ago',
      progress: 10,
      icon: 'book',
      iconColor: '#EF4444',
      iconBg: '#FEE2E2',
    },
  ];

  const filteredLessons = bookmarkedLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'completed') return lesson.progress === 100 && matchesSearch;
    if (selectedFilter === 'in-progress') return lesson.progress > 0 && lesson.progress < 100 && matchesSearch;
    if (selectedFilter === 'recent') return lesson.addedAt.includes('days') && parseInt(lesson.addedAt) <= 3 && matchesSearch;
    if (selectedFilter === 'math') return lesson.category === 'Mathematics' && matchesSearch;
    if (selectedFilter === 'science') return ['Biology', 'Chemistry'].includes(lesson.category) && matchesSearch;
    
    return matchesSearch;
  });

  const renderFilterTab = (tab: any) => (
    <TouchableOpacity
      key={tab.id}
      style={[
        styles.filterTab,
        selectedFilter === tab.id && styles.activeFilterTab,
      ]}
      onPress={() => setSelectedFilter(tab.id)}
    >
      <Text style={[
        styles.filterTabText,
        selectedFilter === tab.id && styles.activeFilterTabText,
      ]}>
        {tab.name}
      </Text>
    </TouchableOpacity>
  );

  const renderBookmarkItem = (item: any) => (
    <View key={item.id} style={styles.bookmarkItem}>
      <View style={styles.bookmarkContent}>
        <View style={[styles.lessonIcon, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
        </View>
        
        <View style={styles.lessonInfo}>
          <View style={styles.lessonHeader}>
            <View style={styles.lessonTitleContainer}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonCategory}>{item.category} • Added {item.addedAt}</Text>
            </View>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.lessonFooter}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${item.progress}%`,
                      backgroundColor: item.progress === 100 ? '#10B981' : '#3B82F6'
                    }
                  ]} 
                />
              </View>
              <Text style={[
                styles.progressText,
                item.progress === 100 && styles.completedProgressText
              ]}>
                {item.progress === 100 ? 'Complete' : `${item.progress}%`}
              </Text>
            </View>
            
            <TouchableOpacity style={[
              styles.actionButton,
              item.progress === 100 ? styles.reviewButton : styles.resumeButton
            ]}>
              <Text style={[
                styles.actionButtonText,
                item.progress === 100 ? styles.reviewButtonText : styles.resumeButtonText
              ]}>
                {item.progress === 100 ? 'Review' : 'Resume'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Swipe to delete area */}
      <View style={styles.deleteArea}>
        <Ionicons name="trash" size={24} color="white" />
      </View>
    </View>
  );

  const getEmptyStateMessage = () => {
    if (searchQuery) {
      return `No bookmarks match "${searchQuery}"`;
    }
    if (selectedFilter === 'all') {
      return 'Start bookmarking your favorite lessons to access them quickly later.';
    }
    return `No ${selectedFilter.replace('-', ' ')} bookmarks yet.`;
  };

  if (bootLoader) {
    return (
      <SafeAreaView style={styles.container}>
        <LogoLoader message="Loading Investa..." fullscreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title="Bookmarks" iconName="bookmark" />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Search bookmarked lessons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        >
          {filterTabs.map(renderFilterTab)}
        </ScrollView>
      </View>

      {/* Bookmark Count */}
      <View style={styles.countSection}>
        <Text style={styles.countText}>{filteredLessons.length} bookmarked lessons</Text>
      </View>

      {/* Bookmarked Lessons List */}
      <FlatList
        data={filteredLessons}
        renderItem={({ item }) => renderBookmarkItem(item)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bookmarksList}
        showsVerticalScrollIndicator={false}
      />

      {filteredLessons.length === 0 && (
        <EmptyState
          icon="bookmark-outline"
          title="No Bookmarks Found"
          message={getEmptyStateMessage()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  filterTabsContainer: {
    paddingHorizontal: 16,
  },
  filterTab: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: '#DBEAFE',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: '#1D4ED8',
  },
  countSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookmarksList: {
    padding: 16,
  },
  bookmarkItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  bookmarkContent: {
    padding: 16,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  lessonCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  heartButton: {
    padding: 4,
    marginTop: -4,
    marginRight: -4,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 64,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedProgressText: {
    color: '#10B981',
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resumeButton: {
    backgroundColor: '#3B82F6',
  },
  reviewButton: {
    backgroundColor: '#F3F4F6',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resumeButtonText: {
    color: 'white',
  },
  reviewButtonText: {
    color: '#6B7280',
  },
  deleteArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: 80 }],
  },
});

export default BookmarksScreen;
