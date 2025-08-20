import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TEXT_MUTED } from '../constants/courseConstants';

type Badge = { icon: keyof typeof Ionicons.glyphMap; from: string; to: string; label: string };

const BadgePill: React.FC<Badge> = ({ icon, from, to, label }) => (
	<View style={styles.center}> 
		<View style={[styles.pill, { backgroundColor: from }]}> 
			<Ionicons name={icon} size={12} color="#fff" />
		</View>
		<Text style={styles.badgeLabel}>{label}</Text>
	</View>
);

const BadgesRow: React.FC<{ badges: Badge[] }> = ({ badges }) => {
	return (
		<View style={styles.row}>
			{badges.map((b, idx) => (
				<BadgePill key={idx} {...b} />
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
	center: { alignItems: 'center' },
	pill: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
	badgeLabel: { color: TEXT_MUTED, fontSize: 12, marginTop: 4 },
});

export default BadgesRow;


