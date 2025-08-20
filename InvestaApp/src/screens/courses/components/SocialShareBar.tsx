import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
	onPress?: (network: 'linkedin' | 'twitter' | 'facebook' | 'instagram') => void;
};

const SocialShareBar: React.FC<Props> = ({ onPress }) => {
	return (
		<View style={styles.row}>
			<TouchableOpacity style={[styles.btn, { backgroundColor: '#2563EB' }]} onPress={() => onPress?.('linkedin')}>
				<Ionicons name="logo-linkedin" size={18} color="#fff" />
			</TouchableOpacity>
			<TouchableOpacity style={[styles.btn, { backgroundColor: '#3B82F6' }]} onPress={() => onPress?.('twitter')}>
				<Ionicons name="logo-twitter" size={18} color="#fff" />
			</TouchableOpacity>
			<TouchableOpacity style={[styles.btn, { backgroundColor: '#1D4ED8' }]} onPress={() => onPress?.('facebook')}>
				<Ionicons name="logo-facebook" size={18} color="#fff" />
			</TouchableOpacity>
			<TouchableOpacity style={[styles.btn, { backgroundColor: '#D946EF' }]} onPress={() => onPress?.('instagram')}>
				<Ionicons name="logo-instagram" size={18} color="#fff" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 },
	btn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
});

export default SocialShareBar;


