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

const { width } = Dimensions.get('window');

const LearningHomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    },
  ];

  const filteredModules = selectedCategory === 'all' 
    ? learningModules 
    : learningModules.filter(module => module.category === selectedCategory);

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
        <View style={[styles.moduleIcon, { backgroundColor: module.color + '20' }]}>
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
          <View style={styles.startButton}>
            <Text style={[styles.startButtonText, { color: module.color }]}>Start</Text>
            <Ionicons name="play" size={16} color={module.color} />
          </View>
        )}
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
        <Text style={styles.headerTitle}>Learning Modules</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#1F2937" />
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
        data={filteredModules}
        renderItem={({ item }) => renderModuleCard(item)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.modulesList}
        showsVerticalScrollIndicator={false}
      />
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
  bookmarkButton: {
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
  modulesList: {
    padding: 20,
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
    borderRadius: 24,
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
    gap: 4,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LearningHomeScreen;
