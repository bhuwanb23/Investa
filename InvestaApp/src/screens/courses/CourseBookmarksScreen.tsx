import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PAGE_BG, CARD_BG, TEXT_DARK, TEXT_MUTED, BORDER, PRIMARY } from './constants/courseConstants';
import BookmarkFilterBar from './components/BookmarkFilterBar';
import BookmarksList, { BookmarkItem } from './components/BookmarksList';
import MainHeader from '../../components/MainHeader';

const CourseBookmarksScreen: React.FC = () => {
	const navigation = useNavigation();
	const [filter, setFilter] = useState<'recent' | 'relevant'>('recent');

	const items = useMemo<BookmarkItem[]>(() => [
		{
			id: 1,
			thumbnailUri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/53f362e3bb-90ea6a0a7e7fd1e7471a.png',
			title: 'Advanced JavaScript Concepts',
			description: 'Master closures, async/await, and advanced ES6+ features in this comprehensive module.',
			minutes: 45,
			difficulty: 'Intermediate',
		},
		{
			id: 2,
			thumbnailUri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f141feb989-a62766ef6f11a8ca0b47.png',
			title: 'UI/UX Design Principles',
			description: 'Learn the fundamentals of user-centered design and create intuitive interfaces.',
			minutes: 32,
			difficulty: 'Beginner',
		},
		{
			id: 3,
			thumbnailUri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0b27246a34-cdecd38f26ac75743412.png',
			title: 'Data Science Fundamentals',
			description: 'Introduction to statistical analysis and machine learning basics for beginners.',
			minutes: 28,
			difficulty: 'Beginner',
		},
	], []);

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={{ paddingBottom: 16 }} stickyHeaderIndices={[0]}>
				<MainHeader title="Bookmarks" iconName="bookmark" showBackButton onBackPress={() => navigation.goBack()} />
				{/* Filters */}
				<BookmarkFilterBar selected={filter} onSelect={setFilter} />
				<View style={{ paddingVertical: 16 }}>
					<View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
						<Text style={styles.countText}>{items.length} bookmarked lessons</Text>
					</View>
					<BookmarksList
						items={items}
						onContinue={(id) => {}}
						onBookmarkToggle={(id) => {}}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: PAGE_BG },
	header: { backgroundColor: CARD_BG, borderBottomWidth: 1, borderBottomColor: BORDER, paddingHorizontal: 16, paddingVertical: 12 },
	headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	headerBtn: { padding: 8 },
	headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
	headerSub: { fontSize: 12, color: TEXT_MUTED },
	countText: { fontSize: 14, color: TEXT_MUTED },
});

export default CourseBookmarksScreen;


