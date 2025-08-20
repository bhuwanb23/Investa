import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CARD_BG, TEXT_DARK, TEXT_MUTED } from '../constants/courseConstants';
import { Ionicons } from '@expo/vector-icons';

type Props = {
	userName: string;
	courseTitle: string;
	completedOn: string;
};

const CertificateCard: React.FC<Props> = ({ userName, courseTitle, completedOn }) => {
	return (
		<View style={styles.wrap}>
			<View style={styles.inner}>
				<View style={styles.medalCircle}>
					<Ionicons name="medal" size={22} color="#fff" />
				</View>
				<Text style={styles.bigTitle}>Certificate of Completion</Text>
				<View style={styles.separator} />
				<Text style={styles.smallMuted}>This certifies that</Text>
				<Text style={styles.person}>{userName}</Text>
				<Text style={styles.smallMuted}>has successfully completed</Text>
				<Text style={styles.course}>{courseTitle}</Text>
				<Text style={styles.date}>Completed on {completedOn}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: { backgroundColor: CARD_BG, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
	inner: { borderWidth: 4, borderColor: '#DDD6FE', borderRadius: 12, padding: 12, backgroundColor: '#F5F3FF' },
	medalCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#6366F1', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
	bigTitle: { textAlign: 'center', fontSize: 16, fontWeight: '800', color: TEXT_DARK, marginBottom: 8 },
	separator: { height: 1, backgroundColor: '#93C5FD', marginVertical: 8 },
	smallMuted: { textAlign: 'center', color: TEXT_MUTED, fontSize: 12, marginBottom: 6 },
	person: { textAlign: 'center', color: TEXT_DARK, fontSize: 16, fontWeight: '700', marginBottom: 8 },
	course: { textAlign: 'center', color: '#7C3AED', fontWeight: '700', marginBottom: 6 },
	date: { textAlign: 'center', color: TEXT_MUTED, fontSize: 11 },
});

export default CertificateCard;


