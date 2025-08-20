import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CARD_BG, TEXT_DARK, TEXT_MUTED } from '../constants/courseConstants';

type Props = {
	icon: keyof typeof Ionicons.glyphMap;
	iconColor: string;
	iconBg: string;
	title: string;
	subtitle: string;
};

const RecentActivityItem: React.FC<Props> = ({ icon, iconColor, iconBg, title, subtitle }) => {
	return (
		<View style={styles.row}> 
			<View style={[styles.circle, { backgroundColor: iconBg }]}>
				<Ionicons name={icon} size={12} color={iconColor} />
			</View>
			<View style={{ flex: 1 }}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.subtitle}>{subtitle}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
	circle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
	title: { fontSize: 13, color: TEXT_DARK, fontWeight: '600' },
	subtitle: { fontSize: 11, color: TEXT_MUTED },
});

export default RecentActivityItem;


