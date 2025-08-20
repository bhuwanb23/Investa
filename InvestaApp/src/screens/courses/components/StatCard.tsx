import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CARD_BG, TEXT_DARK, TEXT_MUTED } from '../constants/courseConstants';
import { Ionicons } from '@expo/vector-icons';

type Props = {
	icon: keyof typeof Ionicons.glyphMap;
	iconColor: string;
	iconBg: string;
	title: string;
	subtitle?: string;
	right?: React.ReactNode;
};

const StatCard: React.FC<Props> = ({ icon, iconColor, iconBg, title, subtitle, right }) => {
	return (
		<View style={styles.card}>
			<View style={styles.rowBetween}>
				<View style={styles.row}> 
					<View style={[styles.iconCircle, { backgroundColor: iconBg }]}> 
						<Ionicons name={icon} size={16} color={iconColor} />
					</View>
					<View>
						<Text style={styles.title}>{title}</Text>
						{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
					</View>
				</View>
				<View style={{ alignItems: 'flex-end' }}>{right}</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: { backgroundColor: CARD_BG, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
	rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	row: { flexDirection: 'row', alignItems: 'center' },
	iconCircle: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
	title: { color: TEXT_DARK, fontWeight: '700' },
	subtitle: { color: TEXT_MUTED, fontSize: 12 },
});

export default StatCard;


