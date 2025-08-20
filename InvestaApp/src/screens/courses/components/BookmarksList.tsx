import React from 'react';
import { View, StyleSheet } from 'react-native';
import BookmarkCard from './BookmarkCard';

export type BookmarkItem = {
	id: number | string;
	thumbnailUri: string;
	title: string;
	description: string;
	minutes: number;
	difficulty: string;
};

type Props = {
	items: BookmarkItem[];
	onContinue: (id: number | string) => void;
	onBookmarkToggle?: (id: number | string) => void;
};

const BookmarksList: React.FC<Props> = ({ items, onContinue, onBookmarkToggle }) => {
	return (
		<View style={styles.list}>
			{items.map((it) => (
				<View key={it.id} style={{ marginBottom: 12 }}>
					<BookmarkCard
						id={it.id}
						thumbnailUri={it.thumbnailUri}
						title={it.title}
						description={it.description}
						minutes={it.minutes}
						difficulty={it.difficulty}
						onContinue={onContinue}
						onBookmarkToggle={onBookmarkToggle}
					/>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	list: { paddingHorizontal: 16 },
});

export default BookmarksList;


