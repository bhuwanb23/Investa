import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';

const { width } = Dimensions.get('window');

const LearningHomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Modules', icon: 'grid' },
    { id: 'basics', name: 'Basics', icon: 'school' },
    { id: 'intermediate', name: 'Intermediate', icon: 'trending-up' },
    { id: 'advanced', name: 'Advanced', icon: 'rocket' },
  ];

  const learningModules = [
    {
      id: 1,
      title: 'What is a Stock?',
      description: 'Learn the fundamental concept of stocks and how they represent ownership in a company.',
      category: 'basics',
      duration: '15 min',
      lessons: 3,
      progress: 0,
      difficulty: 'Beginner',
      icon: 'business',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      id: 2,
      title: 'How Exchanges Work',
      description: 'Understand how stock exchanges function and facilitate trading between buyers and sellers.',
      category: 'basics',
      duration: '20 min',
      lessons: 4,
      progress: 0,
      difficulty: 'Beginner',
      icon: 'trending-up',
      color: '#059669',
      bgColor: '#D1FAE5',
    },
    {
      id: 3,
      title: 'Reading Stock Charts',
      description: 'Master the basics of technical analysis and chart interpretation.',
      category: 'intermediate',
      duration: '25 min',
      lessons: 5,
      progress: 0,
      difficulty: 'Intermediate',
      icon: 'analytics',
      color: '#7C3AED',
      bgColor: '#EDE9FE',
    },
    {
      id: 4,
      title: 'Market Orders',
      description: 'Learn about different types of orders: market, limit, stop-loss, and more.',
      category: 'intermediate',
      duration: '18 min',
      lessons: 3,
      progress: 0,
      difficulty: 'Intermediate',
      icon: 'list',
      color: '#DC2626',
      bgColor: '#FEE2E2',
    },
    {
      id: 5,
      title: 'Portfolio Diversification',
      description: 'Understand the importance of diversification and how to build a balanced portfolio.',
      category: 'advanced',
      duration: '30 min',
      lessons: 6,
      progress: 0,
      difficulty: 'Advanced',
      icon: 'pie-chart',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      id: 6,
      title: 'Risk Management',
      description: 'Learn essential risk management strategies for successful investing.',
      category: 'advanced',
      duration: '22 min',
      lessons: 4,
      progress: 0,
      difficulty: 'Advanced',
      icon: 'shield-checkmark',
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
  ];

  const filteredModules = learningModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    return module.category === selectedCategory && matchesSearch;
  });

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

  const renderModuleCard = (module: any) => (
    <TouchableOpacity
      key={module.id}
      style={styles.moduleCard}
      onPress={() => navigation.navigate('ModuleDetail', { moduleId: module.id })}
      activeOpacity={0.8}
    >
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: module.bgColor }]}>
          <Ionicons name={module.icon as any} size={24} color={module.color} />
        </View>
        <View style={styles.moduleBadge}>
          <Text style={styles.moduleBadgeText}>{module.difficulty}</Text>
        </View>
      </View>

      <Text style={styles.moduleTitle} numberOfLines={2}>
        {module.title}
      </Text>

      <Text style={styles.moduleDescription} numberOfLines={2}>
        {module.description}
      </Text>

      <View style={styles.moduleFooter}>
        <View style={styles.moduleMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{module.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="book-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{module.lessons} lessons</Text>
          </View>
        </View>

        {module.progress > 0 ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${module.progress * 100}%`, backgroundColor: module.color }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(module.progress * 100)}%</Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.startButton, { borderColor: module.color }]}>
            <Text style={[styles.startButtonText, { color: module.color }]}>Start</Text>
            <Ionicons name="play" size={16} color={module.color} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const getEmptyStateMessage = () => {
    if (searchQuery) {
      return `No modules match "${searchQuery}"`;
    }
    if (selectedCategory === 'all') {
      return 'No learning modules available at the moment.';
    }
    return `No ${selectedCategory} modules available.`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning Modules</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Ionicons name="bookmark-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Search modules..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      {/* Module Count */}
      <View style={styles.countSection}>
        <Text style={styles.countText}>{filteredModules.length} modules available</Text>
      </View>

      {/* Modules List */}
      <FlatList
        data={filteredModules}
        renderItem={({ item }) => renderModuleCard(item)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.modulesList}
        showsVerticalScrollIndicator={false}
      />

      {filteredModules.length === 0 && (
        <EmptyState
          icon="school-outline"
          title="No Modules Found"
          message={getEmptyStateMessage()}
        />
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
  bookmarkButton: {
    padding: 8,
    marginRight: -8,
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
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
  countSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modulesList: {
    padding: 16,
  },
  moduleCard: {
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
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  moduleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleMeta: {
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
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LearningHomeScreen;
