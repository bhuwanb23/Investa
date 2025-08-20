import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY, TEXT_MUTED, CARD_BG, BORDER } from '../constants/courseConstants';

type Filter = 'recent' | 'relevant';

type Props = {
	selected: Filter;
	onSelect: (f: Filter) => void;
};

const BookmarkFilterBar: React.FC<Props> = ({ selected, onSelect }) => {
	return (
		<View style={styles.container}>
			<View style={styles.leftGroup}>
				<TouchableOpacity
					style={[styles.pill, selected === 'recent' ? styles.pillActive : styles.pillInactive]}
					onPress={() => onSelect('recent')}
				>
					<Text style={[styles.pillText, selected === 'recent' ? styles.pillTextActive : styles.pillTextInactive]}>Most Recent</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.pill, selected === 'relevant' ? styles.pillActive : styles.pillInactive]}
					onPress={() => onSelect('relevant')}
				>
					<Text style={[styles.pillText, selected === 'relevant' ? styles.pillTextActive : styles.pillTextInactive]}>Most Relevant</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity style={styles.filterBtn}>
				<Ionicons name="filter" size={14} color={TEXT_MUTED} />
				<Text style={styles.filterText}>Filter</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: CARD_BG,
		borderBottomWidth: 1,
		borderBottomColor: BORDER,
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	leftGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	pill: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
	},
	pillActive: { backgroundColor: PRIMARY },
	pillInactive: { backgroundColor: '#F3F4F6' },
	pillText: { fontSize: 12, fontWeight: '600' },
	pillTextActive: { color: '#fff' },
	pillTextInactive: { color: TEXT_MUTED },
	filterBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: 6 },
	filterText: { color: TEXT_MUTED, fontWeight: '600', fontSize: 12 },
});

export default BookmarkFilterBar;


