import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MotivationalBanner: React.FC<{ text: string }> = ({ text }) => {
	return (
		<View style={styles.wrap}>
			<View style={styles.row}> 
				<Ionicons name="star" size={16} color="#FACC15" />
				<Text style={styles.text}>Almost there!</Text>
				<Ionicons name="star" size={16} color="#FACC15" />
			</View>
			<Text style={styles.sub}>{text}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: { backgroundColor: '#7C3AED', borderRadius: 14, padding: 12 },
	row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 },
	text: { color: '#fff', fontWeight: '700' },
	sub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, textAlign: 'center' },
});

export default MotivationalBanner;


