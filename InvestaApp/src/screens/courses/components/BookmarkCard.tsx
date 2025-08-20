import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CARD_BG, BORDER, TEXT_DARK, TEXT_MUTED, PRIMARY } from '../constants/courseConstants';
import { Ionicons } from '@expo/vector-icons';

type Props = {
	id: string | number;
	thumbnailUri: string;
	title: string;
	description: string;
	minutes: number;
	difficulty: string;
	onContinue: (id: string | number) => void;
	onBookmarkToggle?: (id: string | number) => void;
};

const BookmarkCard: React.FC<Props> = ({ id, thumbnailUri, title, description, minutes, difficulty, onContinue, onBookmarkToggle }) => {
	return (
		<View style={styles.card}>
			<View style={styles.row}>
				<Image source={{ uri: thumbnailUri }} style={styles.thumb} />
				<View style={{ flex: 1 }}>
					<View style={styles.titleRow}>
						<Text style={styles.title} numberOfLines={2}>{title}</Text>
						<TouchableOpacity style={styles.iconBtn} onPress={() => onBookmarkToggle && onBookmarkToggle(id)}>
							<Ionicons name="bookmark" size={16} color={PRIMARY} />
						</TouchableOpacity>
					</View>
					<Text style={styles.desc} numberOfLines={2}>{description}</Text>
					<View style={styles.bottomRow}>
						<View style={styles.metaRow}>
							<Text style={styles.metaText}>{minutes} min</Text>
							<View style={styles.dot} />
							<Text style={styles.metaText}>{difficulty}</Text>
						</View>
						<TouchableOpacity style={styles.cta} onPress={() => onContinue(id)}>
							<Text style={styles.ctaText}>Continue</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: CARD_BG,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
		borderWidth: 1,
		borderColor: BORDER,
		overflow: 'hidden',
	},
	row: { flexDirection: 'row' },
	thumb: { width: 80, height: 80, resizeMode: 'cover' },
	titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
	title: { fontSize: 14, fontWeight: '700', color: TEXT_DARK, flex: 1, marginRight: 8 },
	iconBtn: { padding: 6, marginTop: -4, marginRight: -4 },
	desc: { fontSize: 12, color: TEXT_MUTED, marginBottom: 8 },
	bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	metaText: { fontSize: 12, color: TEXT_MUTED },
	dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB' },
	cta: { backgroundColor: PRIMARY, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
	ctaText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});

export default BookmarkCard;


